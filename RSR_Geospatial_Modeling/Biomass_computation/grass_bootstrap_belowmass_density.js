// This script is used for updating the belowground biomass layers of grasses

// Load the data

// Set the worldwide polygon.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Set the rout path

var st = 'your/directory/';
// AgB

var agb = ee.Image('abovegrassbiomass_20200501');



var grass_boot = ee.ImageCollection('grass_boot');


var grass_boot_belowmass = grass_boot.map(function(rsr){
  rsr = rsr.divide(ee.Image(100).subtract(rsr));
  // Get the belowground biomass density.
  var bgb = agb.multiply(rsr).rename('belowmass_density');
  // Map.addLayer(bgb);
  return bgb;
});


print(grass_boot_belowmass);

// Map.addLayer(grass_boot_belowmass);

var meanImage = ee.ImageCollection(grass_boot_belowmass).reduce(ee.Reducer.mean()).rename('grass_belowmass_bootstrapped_mean');
Map.addLayer(meanImage);
var  upperLowerCIImage = ee.ImageCollection(grass_boot_belowmass).reduce(ee.Reducer.percentile([2.5, 97.5], ['lower', 'upper'])).rename(['grass_belowmass_bootstrapped_lower_2_5pct', 'grass_belowmass_bootstrapped_upper_97_5pct']);

var finalImageToExport = ee.Image.cat(
  meanImage,
  upperLowerCIImage);
  
Map.addLayer(finalImageToExport)
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);



  
  
Export.image.toAsset({
  image: finalImageToExport,
  description:'grass_boot_belowmass_summary',
  assetId: 'grass_boot_belowmass_summary',
  region: unboundedGeo,
  crs: 'EPSG:4326',
	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
	maxPixels: 1e13
});
