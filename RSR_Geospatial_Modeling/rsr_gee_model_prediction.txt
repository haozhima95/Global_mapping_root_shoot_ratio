/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// The following script gets the dataset that compare observed RSR data and predicted RSR data from random forest models.
// Here we use forest as an example
//*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

// Import the features
var image = ee.Image("users/haozhima95/rootshootratio/forest_rsr_aggregated_map"),
    table = ee.FeatureCollection("users/haozhima95/rootshootratio/forest_aggregated_cleaned_20191022");

// Sample the model predictions
var fullmodelprediction = image.sampleRegions({
  collection:table,
  geometries:true
});

print(fullmodelprediction.limit(2));
// Export the dataset

Export.table.toDrive({
  collection:fullmodelprediction,
  description:'forest_modelprediction',
  fileFormat:'CSV'
});