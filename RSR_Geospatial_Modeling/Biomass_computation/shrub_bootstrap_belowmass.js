// This script is used for updating the belowground biomass layers of grasses

// Load the data

// Set the worldwide polygon.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Set the rout path

var st = 'your/directory/';
// AgB

var agb = ee.Image('aboveshrubbiomass_20200501');


// RMF maps.
var shrub_boot = ee.ImageCollection('shrub_boot');


var shrub_boot_belowmass = shrub_boot.map(function(rsr){
  rsr = rsr.divide(ee.Image(100).subtract(rsr));
  // Get the belowground biomass density.
  var bgb = agb.multiply(rsr).rename('belowmass_density');
  // Map.addLayer(bgb);
  return bgb;
});


print(shrub_boot_belowmass);

// Map.addLayer(grass_boot_belowmass);

var meanImage = ee.ImageCollection(shrub_boot_belowmass).reduce(ee.Reducer.mean()).rename('shrub_belowmass_bootstrapped_mean');
// Map.addLayer(meanImage);
var  upperLowerCIImage = ee.ImageCollection(shrub_boot_belowmass).reduce(ee.Reducer.percentile([2.5, 97.5], ['lower', 'upper'])).rename(['shrub_belowmass_bootstrapped_lower_2_5pct', 'grass_belowmass_bootstrapped_upper_97_5pct']);

var finalImageToExport = ee.Image.cat(
  meanImage,
  upperLowerCIImage);
  
Map.addLayer(finalImageToExport)
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);



  
  
Export.image.toAsset({
  image: finalImageToExport,
  description:'shrub_boot_belowmass_summary',
  assetId: 'shrub_boot_belowmass_summary',
  region: unboundedGeo,
  crs: 'EPSG:4326',
	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
	maxPixels: 1e13
});
