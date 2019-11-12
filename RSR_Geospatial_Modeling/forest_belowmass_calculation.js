/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// The following script explore the belowground biomass of forest at a global scale.
// This script also calculates the belowground biomass range of forest.
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/




// Define the forest range

var treecover = ee.ImageCollection([tree1,tree2,tree3,tree4]);
    treecover = treecover.reduce(ee.Reducer.sum());
    
// Get the min, max and mean belowground biomass density at a global scale.

var allbelowmass = ee.ImageCollection([image,image2,image3,image4,image5,image6,image7,image8,image9,image10]);

var minbelowmass = allbelowmass.reduce(ee.Reducer.min());

var maxbelowmass = allbelowmass.reduce(ee.Reducer.max());

var meanbelowmass = allbelowmass.reduce(ee.Reducer.mean());

// Calculate the belowground biomass at each pixel

var minmass = minbelowmass.multiply(ee.Image.pixelArea()).divide(1000000).multiply(treecover);
var maxmass = maxbelowmass.multiply(ee.Image.pixelArea()).divide(1000000).multiply(treecover);
var meanmass = meanbelowmass.multiply(ee.Image.pixelArea()).divide(1000000).multiply(treecover);
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Set up a fishnet for calculation

var list = [];
var lon_step = 30;
var lat_step = 22;

for (var lon=-180; lon<180; lon+=lon_step) {
  for (var lat=-88; lat<88; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Rectangle(lon, lat, lon + lon_step, lat + lat_step)));
  }
}

var fc = ee.FeatureCollection(list);

// Sum up the pixel level belowground biomass into the fishnet and then sum up at the global level. 
// We even can export the fishnet to calculate via other ways.
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
  description:'minforestbelowmass',
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
  description:'maxforestbelowmass',
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
  description:'meanforestbelowmass',
  fileFormat:'CSV'
});
