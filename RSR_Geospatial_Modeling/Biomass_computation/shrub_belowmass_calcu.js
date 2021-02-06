// This script is used for calculating total belowground biomass across the globe in shrubland.

// Set the fishnet.

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

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

var belowmeandensity = ee.Image(st+'shrub_belowground_biomass_density_mean_20200501');

var belowmaxdensity = ee.Image(st+'shrub_belowground_biomass_density_max_20200501');

var belowmindensity = ee.Image(st+'shrub_belowground_biomass_density_min_20200501');

var abovedensity = ee.Image('users/haozhima95/aboveshrubbiomass_20200501');


// Shrubland coverage.

var shrub = ee.Image("users/haozhima95/consensus_full_class_shrub");

// Pixel level absolute biomass carbon calculation

var belowmass = belowmeandensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(shrub);

var belowmassmin = belowmindensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(shrub);

var belowmassmax = belowmaxdensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(shrub);

var abovemass = abovedensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(shrub);

// Summarizing acorss the globe.

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
//

//export


// Export.table.toDrive({
//   collection:ss,
//   description:'shrubabovemass',
//   fileFormat:'CSV'
// });

Export.table.toDrive({
  collection:ssabove,
  description:'shrubabovemass_20200521',
  fileFormat:'CSV'
});


Export.table.toDrive({
  collection:ssbelow,
  description:'shrubbelowmass_20200521',
  fileFormat:'CSV'
});

Export.table.toDrive({
  collection:ssbelowmin,
  description:'shrubbelowmassmin_20200521',
  fileFormat:'CSV'
});


Export.table.toDrive({
  collection:ssbelowmax,
  description:'shrubbelowmassmax_20200521',
  fileFormat:'CSV'
});






