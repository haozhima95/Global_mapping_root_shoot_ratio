/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// The fllowing script creates 10 different forest RSR maps according to the saved hyperparameters we did in grid search in Rmd file.
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

var forest = ee.FeatureCollection("users/haozhima95/rootshootratio/forest_rsr_sample_for_grsearch_20191022");

// define tree range

var all_tree = ee.ImageCollection([image, image2, image3, image4]);
    all_tree = all_tree.sum();
var treemask = all_tree.gte(10);
var treerange = all_tree.mask(treemask.gt(0));
Map.addLayer(treerange);

comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);

print(forest.limit(1));

// Instantiate classifiers of interest according to hyperparameter dataset 
var randomForestClassifier = ee.Classifier.randomForest({
	numberOfTrees: 100,
	variablesPerSplit: 6,
	minLeafPopulation:2,
	bagFraction: 0.632,
	seed: 0
}).setOutputMode('REGRESSION');


// Make a list of covariates to use
var covarsToUse_Current = forest.first().propertyNames().removeAll([
  'system:index',
	'index',
	'ratio',
	'Pixel_Long',
	'Pixel_Lat',
	'longitude',
	'latitude',
  'Global_Biomass_IPCC',
  'X',
  'X_1'
]);

print(covarsToUse_Current);
    comp = comp.select(covarsToUse_Current);

// Train the classifiers with the sampled points
var trainedClassifier = randomForestClassifier.train({
  features:forest,
  classProperty:'ratio',
  inputProperties:covarsToUse_Current
});
print(trainedClassifier);

var finalMap = comp.classify(trainedClassifier,'ratio_pred');
    finalMap = finalMap.mask(treerange);

// Define the output region
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000'];
var vis = {min:0.1, max:0.6, palette: colors};


Map.addLayer(finalMap,vis);

// Export the map. The number can be changed according to how many maps you have alread output.

Export.image.toAsset({
  image:finalMap,
  description:'forest_rf_aggregate_first_10',
  assetId:'users/haozhima95/rootshootratio/forest_rsr_model_aggregate_first_10',
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});
