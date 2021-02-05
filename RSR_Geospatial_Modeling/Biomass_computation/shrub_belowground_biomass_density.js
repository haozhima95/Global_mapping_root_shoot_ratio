// This script is used for updating the belowground biomass layers of shrubs

// Load the data

// Set the worldwide polygon.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Set the rout path

var st = 'your directory/';
// AgB

var agb = ee.Image('users/haozhima95/aboveshrubbiomass_20200501');

// Loop

for(var i = 1; i< 11; i++){
  // load the rsr layers.
  var rmf = ee.Image(st+'shrub_rmf_model_aggregate_first_'+i+'_20200517');
  var rsr = rmf.divide(ee.Image(100).subtract(rmf));
  // Get the belowground biomass density.
  var bgb = agb.multiply(rsr);
  
  // Mask the layer
      bgb = bgb.mask(rsr);
      bgb = bgb.updateMask(1);
      Map.addLayer(bgb);
  // Export the layer
  Export.image.toAsset({
    image:bgb,
    description:'shrub_belowground_biomass_density_'+i,
    assetId:st+'shrub_belowground_biomass_density_'+i+'_20200501',
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });
  
}
