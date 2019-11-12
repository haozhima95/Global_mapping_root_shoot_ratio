/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// The following script contains the codes that indicating the percentage of
// interpolation vs. extrapolation.
// This script can be used in differnt vegetation type once we import the target 
// featurecollection.
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var fcWithFullNames = rsr.select(comp.bandNames());
print(fcWithFullNames.limit(5));

    
    
print(fcWithFullNames.size());

var originalBandNames = comp.bandNames();
print('bandname',originalBandNames);
var finalBandsToUse = originalBandNames;

var fcForMinMax = fcWithFullNames.select(finalBandsToUse);
print(fcForMinMax.limit(5));

var propertiesToUse = ee.Feature(fcForMinMax.toList(1).get(0)).propertyNames().remove('system:index');

print(propertiesToUse);

var fcWithBandNames = finalBandsToUse.map(function(bN){return ee.Feature(ee.Geometry.Point([0,0])).set('BandName',bN)});
print(fcWithBandNames);
var fcWithMinMaxValues = ee.FeatureCollection(fcWithBandNames).map(function(fOI){
  var bandBeingComputed = ee.Feature(fOI).get('BandName');
  var maxValueToSet = fcForMinMax.reduceColumns(ee.Reducer.minMax(),[bandBeingComputed]);
  return ee.Feature(fOI).set('MaxValue',maxValueToSet.get('max')).set('MinValue',maxValueToSet.get('min'));
});

print(fcWithMinMaxValues);
Export.table.toAsset({
  collection:fcWithMinMaxValues,
  description:'20190819_rsr_MinMax_Values',
  assetId:'users/haozhima95/rootshootratio/20190819_rsr_MinMax_Values',
});

var fcPrepped = ee.FeatureCollection('users/haozhima95/rootshootratio/20190819_rsr_MinMax_Values');
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

// Define the range by the vegetation distribution
var thre = image.gt(10);

var range = image.mask(thre.gte(1));

    totalBandsPercentage = totalBandsPercentage.mask(range);
    totalBandsPercentage = totalBandsPercentage.updateMask(1);

// Display the maps
var royGBIV = ['d10000','ff6622','ffda21','33dd00','1133cc','220066','330044'];
Map.addLayer(totalBandsPercentage,{palette:royGBIV,min:0,max:1},'Percentile Image - All Bands',false);
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

Export.image.toDrive({
  image:totalBandsPercentage,
  description:'rsr_totalbandspercentage',
  region:unboundedGeo,
  crs:'EPSG:4326',
  maxPixels:1e13
});