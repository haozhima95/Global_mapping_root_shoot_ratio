/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// The following script contains the codes that indicating the percentage of
// interpolation vs. extrapolation.
// This script can be used in differnt vegetation type once we import the target 
// featurecollection.
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Load the featurecollection. Here rsr refers to root shoot ratio. You can rename this by any other name.

var rsr = ee.FeatureCollection('your/named/file') // Input your own feature collection.

// Load the composite you used for randomforest training and extrapolation.

var comp = ee.Image('your/selected/compostie'); // Input your own composite.

// Return a featurecollection that only contains points with selected properties.
var fcWithFullNames = rsr.select(comp.bandNames());
print(fcWithFullNames.limit(5)); // Check the dataset.

    

// Also the band names of the composite you use would also be use to ckeck the coverage.

var originalBandNames = comp.bandNames();
print('bandname',originalBandNames);
var finalBandsToUse = originalBandNames;
// Below is pretty duplicate and a double check of what we did before.
var fcForMinMax = fcWithFullNames.select(finalBandsToUse);
print(fcForMinMax.limit(5));


var propertiesToUse = ee.Feature(fcForMinMax.toList(1).get(0)).propertyNames().remove('system:index');

print(propertiesToUse);



var fcWithBandNames = finalBandsToUse.map(function(bN){return ee.Feature(ee.Geometry.Point([0,0])).set('BandName',bN)});
print(fcWithBandNames);

// Core code to capture the min and max for each band in the dataset.
var fcWithMinMaxValues = ee.FeatureCollection(fcWithBandNames).map(function(fOI){
  var bandBeingComputed = ee.Feature(fOI).get('BandName');
  var maxValueToSet = fcForMinMax.reduceColumns(ee.Reducer.minMax(),[bandBeingComputed]);
  return ee.Feature(fOI).set('MaxValue',maxValueToSet.get('max')).set('MinValue',maxValueToSet.get('min'));
});

print(fcWithMinMaxValues);

// Output this feature collection for future usage.
Export.table.toAsset({
  collection:fcWithMinMaxValues,
  description:'your_MinMax_Values',
  assetId:'your/file/route/MinMax_Values',
});

// Now we make this back and make the max and min images
var fcPrepped = ee.FeatureCollection('your/file/route/MinMax_Values');
var nameValueList = fcPrepped.reduceColumns(ee.Reducer.toList(),['BandName']).get('list');
var maxValuesWNulls = fcPrepped.toList(100).map(function(f){return ee.Feature(f).get('MaxValue')});
var maxDict = ee.Dictionary.fromLists(nameValueList,maxValuesWNulls);
var minValuesWNulls = fcPrepped.toList(100).map(function(f){return ee.Feature(f).get('MinValue')});
var minDict = ee.Dictionary.fromLists(nameValueList,minValuesWNulls);
var minImage = minDict.toImage();
Map.addLayer(minImage,{},'minImage Image',false);
var maxImage = maxDict.toImage();
Map.addLayer(maxImage,{},'maxImage Image',false);

// Select the bands from the composite to match the properties of the FC
var compForExtInt = comp.select(finalBandsToUse);
Map.addLayer(compForExtInt,{},'Composite',false);


//print(us);

//Map.addLayer(us,{},'us',false);



// All bands image
var totalBandsBinary = compForExtInt.gt(minImage.select(finalBandsToUse)).and(compForExtInt.lt(maxImage.select(finalBandsToUse)));
Map.addLayer(totalBandsBinary,{},'Binary Image to Sum',false);
var totalBandsPercentage = totalBandsBinary.reduce('sum').divide(compForExtInt.bandNames().length());
// print(totalBandsBinary)


// Display the maps
var royGBIV = ['d10000','ff6622','ffda21','33dd00','1133cc','220066','330044'];
Map.addLayer(totalBandsPercentage,{palette:royGBIV,min:0,max:1},'Percentile Image - All Bands',false);
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

Export.image.toDrive({
  image:totalBandsPercentage,
  description:'totalbandspercentage',
  region:unboundedGeo,
  crs:'EPSG:4326',
  maxPixels:1e13
});
