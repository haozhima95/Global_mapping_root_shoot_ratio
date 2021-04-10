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





var image = ee.Image("consensus_full_class_tree1"),
    image2 = ee.Image("consensus_full_class_tree2"),
    image3 = ee.Image("consensus_full_class_tree3"),
    image4 = ee.Image("consensus_full_class_tree4"),
    image5 = ee.Image("consensus_full_class_grass"),
    image6 = ee.Image("consensus_full_class_shrub");


// var treecover = ee.ImageCollection([image,image2,image3,image4]);
//     treecover = treecover.reduce(ee.Reducer.sum());

var grassrange = image5.mask(image5.gte(10)); 

var grass_belowmass = ee.Image('grass_boot_belowmass_summary').select([0]);
    grass_belowmass = grass_belowmass.mask(grassrange);

var grass_belowmass_min = ee.Image('grass_boot_belowmass_summary').select([1]);
    grass_belowmass_min = grass_belowmass_min.mask(grassrange);

var grass_belowmass_max = ee.Image('grass_boot_belowmass_summary').select([2]);
    grass_belowmass_max = grass_belowmass_max.mask(grassrange);
    
    Map.addLayer(grass_belowmass_max);
var abovedensity = ee.Image('abovegrassbiomass_20200501');    
    
var belowmass = grass_belowmass.multiply(ee.Image.pixelArea()).divide(1000000).multiply(image5);

var belowmassmin = grass_belowmass_min.multiply(ee.Image.pixelArea()).divide(1000000).multiply(image5);

var belowmassmax = grass_belowmass_max.multiply(ee.Image.pixelArea()).divide(1000000).multiply(image5);

var abovemass = abovedensity.multiply(ee.Image.pixelArea()).divide(1000000).multiply(image5);

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
///
// Export.table.toDrive({
//   collection:ss,
//   description:'treeabovemass',
//   fileFormat:'CSV'
// });

Export.table.toDrive({
  collection:ssabove,
  description:'grassabovemass_boot_20200521',
  fileFormat:'CSV'
});


Export.table.toDrive({
  collection:ssbelow,
  description:'grassbelowmass_boot_20200521',
  fileFormat:'CSV'
});

Export.table.toDrive({
  collection:ssbelowmin,
  description:'grassbelowmassmin_boot_20200521',
  fileFormat:'CSV'
});


Export.table.toDrive({
  collection:ssbelowmax,
  description:'grassbelowmassmax_boot_20200521',
  fileFormat:'CSV'
});
