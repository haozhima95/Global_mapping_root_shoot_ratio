/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// The following script can be used for forests, grasslands or shrublands once you import the layers. 
// The mean of the 10 layers is the final model prediction of RSR distribution at a global scale. 
// Whereas the variation coefficient VC） is regarded as model uncertainties.
// Here we use shrubland as an example
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


// Get the mean
var rsr_all = image.add(image2.add(image3.add(image4.add(image5.add(image6.add(image7.add(image8.add(image9.add(image10))))))))).divide(10);

// Get the std of 10 layers
var rsr_all_bands = image.addBands(image2.addBands(image3.addBands(image4.addBands(image5.addBands(image6.addBands(image7.addBands(image8.addBands(image9.addBands(10)))))))));

var rsr_std = rsr_all_bands.reduce(ee.Reducer.stdDev());
// Get the VC

var rsr_vi = rsr_std.divide(rsr_all);
// Map display
var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000'];
var vis = {min:0, max:3, palette: colors};

Map.addLayer(rsr_all,vis);
Map.addLayer(rsr_vi,vis);

var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Output layers
Export.image.toDrive({
	image: rsr_all,
	description: 'shrub_rsr_aggregated_map',
	region: unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toAsset({
	image: rsr_all,
	assetId:'users/haozhima95/rootshootratio/shrub_rsr_aggregated_map',
	description: 'shrub_rsr_aggregated_map',
	region: unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});


Export.image.toDrive({
	image: rsr_vi,
	description: 'shrub_vc',
	region: unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});

Export.image.toAsset({
  image: shrub_vi,
	description: 'shrub_vc',
	assetId:'users/haozhima95/rootshootratio/shrub_vc',
	region: unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});
