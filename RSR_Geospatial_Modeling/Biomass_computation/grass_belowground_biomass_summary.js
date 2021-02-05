// This is script is used for grassland biomass density layers.

// set the file path

var st = 'users/haozhima95/rootshootratio/';

// Set the worldwide polygon.

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


// Load the layer

var bgb = ee.Image(st+'grass_belowground_biomass_density_1_20200501');

// get a list of layers.

var bgblist = ee.List([bgb]);

// Loop the layers.

for(var i = 2; i<11; i++){
  var addon = ee.Image(st+'grass_belowground_biomass_density_'+i+'_20200501');
      bgblist = bgblist.add(addon);
}

// Get the image collection.

var bgbcollection = ee.ImageCollection(bgblist);

// Get the mean

var bgbmean = bgbcollection.reduce(ee.Reducer.mean());
Map.addLayer(bgbmean);
// Get the min

var bgbmin = bgbcollection.reduce(ee.Reducer.min());

// Get the max

var bgbmax = bgbcollection.reduce(ee.Reducer.max());

// Get the std

var bgbstd = bgbcollection.reduce(ee.Reducer.stdDev());

// Get the variation coefficient (standard deviation divided by mean)

var bgbvc = bgbstd.divide(bgbmean);

// Export the layers.
// The mean
Export.image.toAsset({
    image:bgbmean,
    description:'grass_belowground_biomass_density_mean_20200501',
    assetId:st+'grass_belowground_biomass_density_mean_20200501',
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });

// std
Export.image.toAsset({
    image:bgbstd,
    description:'grass_belowground_biomass_density_std_20200501',
    assetId:st+'grass_belowground_biomass_density_std_20200501',
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });


// The vc
Export.image.toAsset({
    image:bgbvc,
    description:'grass_belowground_biomass_density_vc_20200501',
    assetId:st+'grass_belowground_biomass_density_vc_20200501',
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });

// Min.

Export.image.toAsset({
    image:bgbmin,
    description:'grass_belowground_biomass_density_min_20200501',
    assetId:st+'grass_belowground_biomass_density_min_20200501',
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });

// Max


Export.image.toAsset({
    image:bgbmax,
    description:'grass_belowground_biomass_density_max_20200501',
    assetId:st+'grass_belowground_biomass_density_max_20200501',
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });
