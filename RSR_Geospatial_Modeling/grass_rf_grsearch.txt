/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// This script creates 10 different maps based on our grassland samples and hyperparameters from grid search
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Import the features

var grass = ee.FeatureCollection("users/haozhima95/rootshootratio/grass_rsr_sample_for_grsearch_20191022");


// Initiate hyperparameters according to the hyperparameter dataset
var ntree = [150,80,100,50,150,50,150,100,100,100];
print(ntree);

var mtry = [5,8,5,5,6,8,10,10,6,4];
print(mtry);

// Add two important layers to the covariate composite
    comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);

// Define the grassland range at a global scale
    
var grassmask = image.gte(10);

var grassrange = image.mask(grassmask.gt(0));

// Use a loop to output all the maps
for(var i = 0; i<10; i++){
  
  var randomForestClassifier = ee.Classifier.randomForest({
	numberOfTrees: ntree[i],
	variablesPerSplit: mtry[i],
	minLeafPopulation:2,
	bagFraction: 0.632,
	seed: 0
}).setOutputMode('REGRESSION');

// Make a list of covariates to use
var covarsToUse_Current = grass.first().propertyNames().removeAll([
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

//Train the classifiers with the sampled points
var trainedClassifier = randomForestClassifier.train({
  features:grass,
  classProperty:'ratio',
  inputProperties:covarsToUse_Current
});
print(trainedClassifier);

var finalMap = comp.classify(trainedClassifier,'ratio_pred');
    finalMap = finalMap.mask(grassrange);


var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000'];
var vis = {min:1, max:12, palette: colors};


Map.addLayer(finalMap,vis);
var st = i+1
Export.image.toAsset({
  image:finalMap,
  description:'grass_rf_aggregate_first_'+st,
  assetId:'users/haozhima95/rootshootratio/grass_rsr_model_aggregate_first_'+st,
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});



}