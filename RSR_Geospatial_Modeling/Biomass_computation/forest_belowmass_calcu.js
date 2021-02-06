// This script is used for calculating total belowground biomass carbon in forests.

// Set a fishnet.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Set grid cell size
var list = [];
var lon_step = 30;
var lat_step = 22;

for (var lon=-180; lon<180; lon+=lon_step) {
  for (var lat=-88; lat<88; lat+=lat_step) {
    list.push(ee.Feature(ee.Geometry.Rectangle(lon, lat, lon + lon_step, lat + lat_step)));
  }
}

var fc = ee.FeatureCollection(list);


// Load the belowmass layers.

// set the file path.

var st = 'your directory/';

// load the images.

var belowmeandensity = ee.Image(st+'forest_belowground_biomass_density_mean_20200501');

var belowmaxdensity = ee.Image(st+'forest_belowground_biomass_density_max_20200501');

var belowmindensity = ee.Image(st+'forest_belowground_biomass_density_min_20200501');

var abovedensity = ee.Image('users/haozhima95/abovetreebiomass_20200501');
// Treecover.

var image = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4"),

var treecover = ee.ImageCollection([image,image2,image3,image4]);
    treecover = treecover.sum();
    
// From biomass carbion density per pixel to absolute biomass carbon per pixel, scaled by pixel area and vegetation type coverage.    
var belowmass = belowmeandensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(treecover);

var belowmassmin = belowmindensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(treecover);

var belowmassmax = belowmaxdensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(treecover);
   
var abovemass = abovedensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(treecover);

// Summarize in each fishnet.
var ssabove = fc.map(function(ff){
   var xx = abovemass.reduceRegions({
     collection:ff,
     reducer:ee.Reducer.sum(),
     tileScale:16
   });
   return xx;
});


ssabove = ssabove.flatten();

print(ssabove.aggregate_sum('sum'));


var ssbelow = fc.map(function(ff){
   var xx = belowmass.reduceRegions({
     collection:ff,
     reducer:ee.Reducer.sum(),
     tileScale:16
   });
   return xx;
});


ssbelow = ssbelow.flatten();

print(ssbelow.aggregate_sum('sum'));

var ssbelowmin = fc.map(function(ff){
   var xx = belowmassmin.reduceRegions({
     collection:ff,
     reducer:ee.Reducer.sum(),
     tileScale:16
   });
   return xx;
});


ssbelowmin = ssbelowmin.flatten();
print(ssbelowmin.aggregate_sum('sum'));

var ssbelowmax = fc.map(function(ff){
   var xx = belowmassmax.reduceRegions({
     collection:ff,
     reducer:ee.Reducer.sum(),
     tileScale:16
   });
   return xx;
});


ssbelowmax = ssbelowmax.flatten();
print(ssbelowmax.aggregate_sum('sum'));



// Outputting.
Export.table.toDrive({
  collection:ssabove,
  description:'treeabovemass_20200521',
  fileFormat:'CSV'
});


Export.table.toDrive({
  collection:ssbelow,
  description:'treebelowmass_20200521',
  fileFormat:'CSV'
});

Export.table.toDrive({
  collection:ssbelowmin,
  description:'treebelowmassmin_20200521',
  fileFormat:'CSV'
});


Export.table.toDrive({
  collection:ssbelowmax,
  description:'treebelowmassmax_20200521',
  fileFormat:'CSV'
});
    
