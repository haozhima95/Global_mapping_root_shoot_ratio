// This script is used for bootstrapping shrub rmf model for evaluating uncertainty. Contributed by Johan van den Hoogen.


var comp = ee.Image("users/haozhima95/Devin_environment_composite_20190218"),
    soil_moisture = ee.Image("users/haozhima95/wld_soil_moisture"),
    water_depth = ee.Image("users/haozhima95/water_depth"),
    image = ee.Image("users/haozhima95/consensus_full_class_shrub");
    
 
 
 // Import the features

var shrub_collection = ee.FeatureCollection("your directory/shrub_rsr_sample_for_grsearch_20200517");

var tn = ee.Image('users/haozhima95/total_nitrogen_soilgrids_0_to_200cm');

var cnratio = ee.Image('users/haozhima95/cnratio_from_caesar').rename('cnratio');


// Add two important covariates to the composite

    comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);
    comp = comp.addBands(tn);
    comp = comp.addBands(cnratio);
    
// Define the range of shrubland at a global scale    
// var shrubmask = image.gte(10);

// var shrubrange = image.mask(shrubmask.gt(0));

// Make a list of covariates to use
var covarsToUse_Current = shrub_collection.first().propertyNames().removeAll([
  'system:index',
	'index',
	'ratio',
	'Pixel_Long',
	'Pixel_Lat',
	'longitude',
	'latitude',
  'Global_Biomass_IPCC',
  'X',
  'X_1',
  'Abs_Lat',
  'rmf'
]);

print(covarsToUse_Current);
    comp = comp.select(covarsToUse_Current);


var orig_prediction = ee.Image('users/haozhima95/rootshootratio/shrub_rmf_model_aggregate_first_1_20200517')


// ////////////////////////////////////////////////////////////////////////////////////////////////////////////
// // Bootstrapping 
// ////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Sample WWF_Biome layer, to use for stratification when creating bootstrap samples
var WWF_Biome = ee.Image('projects/crowtherlab/Composite/CrowtherLab_Composite_30ArcSec').select('WWF_Biome')
var sampled_points = WWF_Biome.sampleRegions({
                            collection: shrub_collection,
                            scale: WWF_Biome.projection().nominalScale(),
                            tileScale: 16,
                            geometries: true
                        });

// Print info on the points and display them
print(sampled_points.limit(1));

// Export the sampled data
Export.table.toAsset({
	collection: sampled_points,
	description: 'rmf_shrub_sampled_points',
	assetId: 'users/johanvandenhoogen/2021_rmf_rerun/rmf_shrub_sampled_points_wBiome'
});

// var sampled_points = ee.FeatureCollection('users/johanvandenhoogen/2021_rmf_rerun/rmf_shrub_sampled_points_wBiome')//.set('band_order', covarsToUse_Current)

// Correct the floating point issue with the WWF Biome integers
var collToBootstrap = sampled_points.map(function(f) {
	return ee.Feature(null).set('WWF_Biome', ee.Number(f.get('WWF_Biome')).round()).copyProperties({
		source: f,
		exclude: ['WWF_Biome']
	});
});


// Instantiate classifier of interest

var randomForestClassifier = ee.Classifier.smileRandomForest({
	numberOfTrees: 150,
	variablesPerSplit: 8,
	minLeafPopulation:2,
	bagFraction: 0.632,
	seed: 0
}).setOutputMode('REGRESSION');

// Train the classifier with the sampled points
var trainedClassifier = randomForestClassifier.train({
  features:collToBootstrap,
  classProperty:'rmf',
  inputProperties:covarsToUse_Current
});

var classifiedImageSingleMap = comp.classify(trainedClassifier,'rmf_pred');

Map.addLayer(orig_prediction)
Map.addLayer(classifiedImageSingleMap)

// ///////// both are identical > CHECK

// Input the name of the stratification variable
var stratVariable = 'WWF_Biome';

// Make a list of seeds to use for the bootstrapping
function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 100;
var seedsForBootstrapping = JSsequence(numberOfSubsets);

// Create an unbounded geometry for exports
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Boostrap the collection before training the classififers, then apply the classifier to create the bootstrapped images

// Input a base image name for exporting and organizational purposes
var bootstrapFileName = 'shrub_rmf_Bootstrap_';

// Load the bootstrap function
var bootStrap = require('users/devinrouth/toolbox:Stratified_Bootstrap_FeatureCollection.js');

// Make a function to pad numbers with leading zeroes for formatting purposes
function pad(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}


// Create bootstrap samples, train images, export to ImageCollection
seedsForBootstrapping.map(function(seedToUse) {

	var boostrapSampleForTraining = bootStrap.makeStratBootStrapFeatureCollection(collToBootstrap,stratVariable, 100, seedToUse);

	// Train the classifers with the sampled points
	var trainedBootstrapClassifier = randomForestClassifier.train({
		features: boostrapSampleForTraining,
		classProperty: 'rmf',
		inputProperties: covarsToUse_Current
	});

	// Apply the classifier to the composite to make the final map
	var bootstrapImage = comp.classify(trainedBootstrapClassifier);

	// Export the image
	Export.image.toAsset({
		image: bootstrapImage,//.mask(shrubrange),
		description: bootstrapFileName + pad(seedToUse,2),
		assetId: 'projects/crowtherlab/johan/2021_rmf_rerun/shrub_bootstrapColls/' + bootstrapFileName + pad(seedToUse,2),
		region: unboundedGeo,
		crs: 'EPSG:4326',
		crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
		maxPixels: 1e13
	});

});


// // Once the boostrap iterations are complete, run the upper and lower confidence interval bounds
var bootstrapIterations = ee.ImageCollection('projects/crowtherlab/johan/2021_rmf_rerun/shrub_bootstrapColls')
print('Bootstrap Iterations Collection', bootstrapIterations);
print('Number of bootstraps completed:', bootstrapIterations.size())

var meanImage = ee.ImageCollection(bootstrapIterations).reduce(ee.Reducer.mean()).rename('rmf_bootstrapped_mean')

var stdDevImage = ee.ImageCollection(bootstrapIterations).reduce(ee.Reducer.stdDev()).rename('rmf_bootstrapped_stdDev')

var  upperLowerCIImage = ee.ImageCollection(bootstrapIterations).reduce(ee.Reducer.percentile([2.5, 97.5], ['lower', 'upper'])).rename(['rmf_bootstrapped_lower_2_5pct', 'rmf_bootstrapped_upper_97_5pct'])

var finalImageToExport = ee.Image.cat(
classifiedImageSingleMap,
meanImage,
upperLowerCIImage,
stdDevImage)//.mask(shrubrange)


// Export the image
Export.image.toAsset({
	image: finalImageToExport,
	description: 'rmf_shrub_bootstrapped_images',
	assetId: 'users/johanvandenhoogen/2021_rmf_rerun/shrub_rmf_Bootstrapped_MultibandImage',
	region: unboundedGeo,
	crs: 'EPSG:4326',
	crsTransform: [0.008333333333333333, 0, -180, 0, -0.008333333333333333, 90],
	maxPixels: 1e13
});
