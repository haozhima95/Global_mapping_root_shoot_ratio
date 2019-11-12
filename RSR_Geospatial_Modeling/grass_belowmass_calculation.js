/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// This script explores the belowground biomass of grassland.
// We also explore the mean min and max values of belowground biomass of grassland at a global scale.
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


// Get the min max and mean of belowground biomass density
var allbelowmass = ee.ImageCollection([image,image2,image3,image4,image5,image6,image7,image8,image9,image10]);

var minbelowmass = allbelowmass.reduce(ee.Reducer.min());

var maxbelowmass = allbelowmass.reduce(ee.Reducer.max());

var meanbelowmass = allbelowmass.reduce(ee.Reducer.mean());

// calculate belowground biomass at each pixel

var minmass = minbelowmass.multiply(ee.Image.pixelArea()).divide(1000000).multiply(grasscover);
var maxmass = maxbelowmass.multiply(ee.Image.pixelArea()).divide(1000000).multiply(grasscover);
var meanmass = meanbelowmass.multiply(ee.Image.pixelArea()).divide(1000000).multiply(grasscover);

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Initiate a fishnet

var list = [];
var lon_step = 30;
var lat_step = 22;

for (var lon=-180; lon<180; lon+=lon_step) {
  for (var lat=-88; lat<88; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Rectangle(lon, lat, lon + lon_step, lat + lat_step)));
  }
}

var fc = ee.FeatureCollection(list);

// sum up the pixel level value into each region. Print the total belowground biomass and export the fishnet table.

var ss = fc.map(function(f){
  var below = minmass.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16,
    scale:1000
  });
  return below
});
ss = ss.flatten();
print(ss.aggregate_sum('sum'));
Export.table.toDrive({
  collection:ss,
  description:'mingrassbelowmass',
  fileFormat:'CSV'
});

var sa = fc.map(function(f){
  var below = maxmass.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16,
    scale:1000
  });
  return below
});
sa = sa.flatten();
print(sa.aggregate_sum('sum'));
Export.table.toDrive({
  collection:sa,
  description:'maxgrassbelowmass',
  fileFormat:'CSV'
});


var sm = fc.map(function(f){
  var below = meanmass.reduceRegions({
    collection:f,
    reducer:ee.Reducer.sum(),
    tileScale:16,
    scale:1000
  });
  return below
});
sm = sm.flatten();
print(sm.aggregate_sum('sum'));
Export.table.toDrive({
  collection:sm,
  description:'meangrassbelowmass',
  fileFormat:'CSV'
});

