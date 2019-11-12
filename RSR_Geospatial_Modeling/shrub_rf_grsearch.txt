/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// the following script creates 10 different models according to shrubland features and hyperparameters of the randomforest model.
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Import the features

var shrub = ee.FeatureCollection("users/haozhima95/rootshootratio/shrub_rsr_sample_for_grsearch_20191024");

// Initialize hyperparameters

var ntree = [150,100,150,100,100,150,50,150,50,100];
print(ntree);

var mtry = [5,5,6,4,6,4,5,7,4,8];
print(mtry);

var leafpop = [2,2,2,2,2,2,2,2,2,2];
// Add two important covariates to the composite

    comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);
// Define the range of shrubland at a global scale    
var shrubmask = image.gte(10);

var shrubrange = image.mask(shrubmask.gt(0));

// Initialize 10 different models and output the maps
for(var i = 0; i<10; i++){
  
  
  var randomForestClassifier = ee.Classifier.randomForest({
	numberOfTrees: ntree[i],
	variablesPerSplit: mtry[i],
	minLeafPopulation:leafpop[i],
	bagFraction: 0.632,
	seed: 0
}).setOutputMode('REGRESSION');

// Make a list of covariates to use
var covarsToUse_Current = shrub.first().propertyNames().removeAll([
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
  'Abs_Lat'
]);

print(covarsToUse_Current);
    comp = comp.select(covarsToUse_Current);

//Train the classifiers with the sampled points
var trainedClassifier = randomForestClassifier.train({
  features:shrub,
  classProperty:'ratio',
  inputProperties:covarsToUse_Current
});
print(trainedClassifier);

var finalMap = comp.classify(trainedClassifier,'ratio_pred');
    finalMap = finalMap.mask(shrubrange);


var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000'];
var vis = {min:0, max:4, palette: colors};


Map.addLayer(finalMap,vis);
var st = i+1
Export.image.toAsset({
  image:finalMap,
  description:'shrub_rf_aggregate_first_'+st,
  assetId:'users/haozhima95/rootshootratio/shrub_rsr_model_aggregate_first_'+st,
  crs:'EPSG:4326',
  region:unboundedGeo,
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});



}