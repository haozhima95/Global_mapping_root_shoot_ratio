// This script is used for aggregating rsr layers of new modelled grasslands and shrublands.

// Load the data

// Set the file path.

var st = 'users/haozhima95/rootshootratio/';
// Set the cover

var image = ee.Image("users/haozhima95/consensus_full_class_tree1"),
    image2 = ee.Image("users/haozhima95/consensus_full_class_tree2"),
    image3 = ee.Image("users/haozhima95/consensus_full_class_tree3"),
    image4 = ee.Image("users/haozhima95/consensus_full_class_tree4");

var grasscover = ee.Image("users/haozhima95/consensus_full_class_grass");

var shrubcover = ee.Image("users/haozhima95/consensus_full_class_shrub");

var all_tree = ee.ImageCollection([image, image2, image3, image4]);
    all_tree = all_tree.sum();
var treemask = all_tree.gte(10);
var treerange = all_tree.mask(treemask.gt(0));

var grassmask = grasscover.gte(10);

var grassrange = grasscover.mask(grassmask.gt(0));

var shrubmask = shrubcover.gte(10);

var shrubrange = shrubcover.mask(shrubmask.gt(0));


// Forests.
var forestmodelname = 'forest_rmf_model_aggregate_first_'
var forest = ee.Image(st+forestmodelname+'1_20200517');
// Get the list.
var forestlist = ee.List([forest]);
// Loop the rest layers and add them to the list.
for(var i = 2; i<11; i++){
  var forestaddon = ee.Image(st+forestmodelname+i+'_20200517');
  // Add to the list.
      forestlist = forestlist.add(forestaddon);
}



// Grasslands.
var grassmodelname = 'grass_rmf_model_aggregate_first_'
var grass = ee.Image(st+grassmodelname+'1_20200517');
// Get the list.
var grasslist = ee.List([grass]);
// Loop the rest layers and add them to the list.
for(var i = 2; i<11; i++){
  var grassaddon = ee.Image(st+grassmodelname+i+'_20200517');
  // Add to the list.
      grasslist = grasslist.add(grassaddon);
}

// Shurblands.
var shrubmodelname = 'shrub_rmf_model_aggregate_first_'
var shrub = ee.Image(st+grassmodelname+'1_20200517');
// Get the list.
var shrublist = ee.List([shrub]);
// Loop the rest layers and add them to the list.
for(var i = 2; i<11; i++){
  var shrubaddon = ee.Image(st+shrubmodelname+i+'_20200517');
  // Add to the list.
      shrublist = shrublist.add(shrubaddon);
}


// Get the both image collections.

// Forests.
var forestcollection = ee.ImageCollection(forestlist);
// Grassland.
var grasscollection = ee.ImageCollection(grasslist);
// Shrubland.
var shrubcollection = ee.ImageCollection(shrublist);

// Get the mean of both layers.
var forestmean = forestcollection.reduce(ee.Reducer.mean());
    forestmean = forestmean.mask(treerange);
var grassmean = grasscollection.reduce(ee.Reducer.mean());
    grassmean = grassmean.mask(grassrange);
var shrubmean = shrubcollection.reduce(ee.Reducer.mean());
    shrubmean = shrubmean.mask(shrubrange);
Map.addLayer(forestmean);
Map.addLayer(grassmean);
Map.addLayer(shrubmean);
// Get the std of both layers.
var foreststd = forestcollection.reduce(ee.Reducer.stdDev());
var grassstd = grasscollection.reduce(ee.Reducer.stdDev());
var shrubstd = shrubcollection.reduce(ee.Reducer.stdDev());

// Get the min and max of both layers.
var forestmax = forestcollection.reduce(ee.Reducer.max());
var grassmax = grasscollection.reduce(ee.Reducer.max());
var shrubmax = shrubcollection.reduce(ee.Reducer.max());

var forestmin = forestcollection.reduce(ee.Reducer.min());
var grassmin = grasscollection.reduce(ee.Reducer.min());
var shrubmin = shrubcollection.reduce(ee.Reducer.min());


// Export these fucking layers.

var vegetype = ['grass','shrub'];

var modeltype = ['mean','std','min','max'];

// Set the polygon

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

Export.image.toAsset({
  image:forestmean,
  description:'forest_rmf_map_mean_20200517',
  assetId:st+'forest_rmf_map_mean_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:forestmean,
  description:'forest_rmf_map_mean_20200517',
  // assetId:st+'forest_rmf_map_mean_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toAsset({
  image:grassmean,
  description:'grass_rmf_map_mean_20200517',
  assetId:st+'grass_rsr_map_mean_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:grassmean,
  description:'grass_rmf_map_mean_20200517',
  // assetId:st+'grass_rsr_map_mean_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toAsset({
  image:shrubmean,
  description:'shrub_rmf_map_mean_20200517',
  assetId:st+'shrub_rmf_map_mean_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:shrubmean,
  description:'shrub_rmf_map_mean_20200517',
  // assetId:st+'shrub_rmf_map_mean_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toAsset({
  image:foreststd,
  description:'forest_rmf_map_std_20200517',
  assetId:st+'forest_rmf_map_std_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:foreststd,
  description:'forest_rmf_map_std_20200517',
  // assetId:st+'forest_rmf_map_std_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toAsset({
  image:grassstd,
  description:'grass_rmf_map_std_20200517',
  assetId:st+'grass_rmf_map_std_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:grassstd,
  description:'grass_rmf_map_std_20200517',
  // assetId:st+'grass_rmf_map_std_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toAsset({
  image:shrubstd,
  description:'shrub_rmf_map_std_20200517',
  assetId:st+'shrub_rmf_map_std_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:shrubstd,
  description:'shrub_rmf_map_std_20200517',
  // assetId:st+'shrub_rmf_map_std_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toAsset({
  image:forestmin,
  description:'forest_rmf_map_min_20200517',
  assetId:st+'forest_rmf_map_min_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:forestmin,
  description:'forest_rmf_map_min_20200517',
  // assetId:st+'forest_rmf_map_min_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toAsset({
  image:grassmin,
  description:'grass_rmf_map_min_20200517',
  assetId:st+'grass_rmf_map_min_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:grassmin,
  description:'grass_rmf_map_min_20200517',
  // assetId:st+'grass_rmf_map_min_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toAsset({
  image:shrubmin,
  description:'shrub_rmf_map_min_20200517',
  assetId:st+'shrub_rmf_map_min_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:shrubmin,
  description:'shrub_rmf_map_min_20200517',
  // assetId:st+'shrub_rmf_map_min_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toAsset({
  image:forestmax,
  description:'forest_rmf_map_max_20200517',
  assetId:st+'forest_rmf_map_max_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:forestmax,
  description:'forest_rmf_map_max_20200517',
  // assetId:st+'forest_rmf_map_max_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toAsset({
  image:grassmax,
  description:'grass_rmf_map_max_20200517',
  assetId:st+'grass_rmf_map_max_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toDrive({
  image:grassmax,
  description:'grass_rmf_map_max_20200517',
  // assetId:st+'grass_rmf_map_max_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toAsset({
  image:shrubmax,
  description:'shrub_rmf_map_max_20200517',
  assetId:st+'shrub_rmf_map_max_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toDrive({
  image:shrubmax,
  description:'shrub_rmf_map_max_20200517',
  // assetId:st+'shrub_rmf_map_max_20200517',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});



