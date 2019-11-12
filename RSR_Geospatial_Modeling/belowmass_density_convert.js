/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// The following script explores the belowground biomass density in three different vegetation types via differnt RSR models
// All the layers are exported for further aggregations and calculations.

// Explore the distribution of aboveground biomass. 

// Here use shrubland for example.

var colors = ['00007F', '0000FF', '0074FF',
              '0DFFEA', '8CFF41', 'FFDD00',
              'FF3700', 'C30000'];
var vis = {min:0, max:70, palette: colors};    
Map.addLayer(shrubmass);
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Initilize the loop that convert aboveground biomass to belowground biomass and export.

for(var i = 1; i<11; i++){
  var tree_rsr = ee.Image('users/haozhima95/rootshootratio/forest_rsr_model_aggregate_first_'+i);
  //var mass = treemass.mask(tree_rsr);
  //Map.addLayer(tree_rsr);
  var treebelow = treemass.multiply(tree_rsr);
      treebelow = treebelow.updateMask(1);
  //Map.addLayer(treebelow,vis);
  Export.image.toAsset({
    image:treebelow,
    description:'forest_belowmass_density_'+i,
    assetId:'users/haozhima95/rootshootratio/forest_belowmass_density_'+i,
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });
 
 
 
 var grass_rsr = ee.Image('users/haozhima95/rootshootratio/grass_rsr_model_aggregate_first_'+i);
  //var mass = treemass.mask(tree_rsr);
  //Map.addLayer(tree_rsr);
  var grassbelow = grassmass.multiply(grass_rsr);
      grassbelow = grassbelow.updateMask(1);
  //Map.addLayer(grassbelow,vis);
  Export.image.toAsset({
    image:grassbelow,
    description:'grass_belowmass_density_'+i,
    assetId:'users/haozhima95/rootshootratio/grass_belowmass_density_'+i,
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
    maxPixels: 1e13
  });
  
  var shrub_rsr = ee.Image('users/haozhima95/rootshootratio/shrub_rsr_model_aggregate_first_'+i);
  //var mass = treemass.mask(tree_rsr);
  //Map.addLayer(tree_rsr);
  var shrubbelow = shrubmass.multiply(shrub_rsr);
      shrubbelow = shrubbelow.mask(shrub_rsr);
      //shrubbelow = shrubbelow.updateMask(1);
  Map.addLayer(shrubbelow,vis);
  Export.image.toAsset({
    image:shrubbelow,
    description:'shrub_belowmass_density_'+i,
    assetId:'users/haozhima95/rootshootratio/shrub_belowmass_density_'+i,
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });
}
