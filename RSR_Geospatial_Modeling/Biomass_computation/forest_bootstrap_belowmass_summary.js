var forest_boot_belowmass = ee.ImageCollection('forest_boot/forest_belowmass_boot');

var meanImage = ee.ImageCollection(forest_boot_belowmass).reduce(ee.Reducer.mean()).rename('forest_belowmass_bootstrapped_mean')
var  upperLowerCIImage = ee.ImageCollection(forest_boot_belowmass).reduce(ee.Reducer.percentile([2.5, 97.5], ['lower', 'upper'])).rename(['forest_belowmass_bootstrapped_lower_2_5pct', 'forest_belowmass_bootstrapped_upper_97_5pct']);

var finalImageToExport = ee.Image.cat(
  meanImage,
  upperLowerCIImage);
  
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);



  
  
Export.image.toAsset({
  image: finalImageToExport,
  description:'forest_boot_belowmass_summary',
  assetId: 'forest_boot_belowmass_summary',
  region: unboundedGeo,
  crs: 'EPSG:4326',
	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
	maxPixels: 1e13
});

