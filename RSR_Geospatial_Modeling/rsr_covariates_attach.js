// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// This script attaches environmental covariates to our cleaned sample records for
// further grid search approach
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    

// Choose the layers that cover the most records
comp = comp.addBands(soil_moisture);
    comp = comp.addBands(water_depth);

// Here we need to check the coverage of sampled points
   for(var i = 0; i<comp.size(); i++){

     var im = comp.select(i);
    
     var sampled = im.sampleRegions({
       collection:forest,
       geometries:true
     });
     print(i);
     print(im);
     print(sampled.size());
   }
   
var bandlist = [0,1,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82]
//  These bands are selected because they cover most of the sampled data points.  
    comp = comp.select(bandlist);
    print(comp.bandNames());
    print(forest.size());
    var im = comp.select(0);
    var sampled = im.sampleRegions({
     collection:forest,
     geometries:true
     
   });
   //print(sampled.size());
   Map.addLayer(forest,{color:'red'});
   Map.addLayer(sampled);

// sample records attaching
var sample_forest = comp.sampleRegions({
  collection:forest,
  geometries:true
});

var sample_grass = comp.sampleRegions({
  collection:grass,
  geometries:true
});

var sample_shrub = comp.sampleRegions({
  collection:shrub,
  geometries:true
});

// Export these datasets

Export.table.toDrive({
  collection:sample_forest,
  description:'forest_rsr_sample_for_grsearch_20190122',
  fileFormat:'CSV'
});
Export.table.toDrive({
  collection:sample_grass,
  description:'grass_rsr_sample_for_grsearch_20191022',
  fileFormat:'CSV'
});

Export.table.toDrive({
  collection:sample_shrub,
  description:'shrub_rsr_sample_for_grsearch_20191024',
  fileFormat:'CSV'
});


Export.table.toAsset({
  collection:sample_forest,
  description:'forest_rsr_sample_for_grsearch_20190122',
  assetId:'users/haozhima95/rootshootratio/forest_rsr_sample_for_grsearch_20191022'
});

Export.table.toAsset({
  collection:sample_grass,
  description:'grass_rsr_sample_for_grsearch_20190122',
  assetId:'users/haozhima95/rootshootratio/grass_rsr_sample_for_grsearch_20191022'
});

Export.table.toAsset({
  collection:sample_shrub,
  description:'shrub_rsr_sample_for_grsearch_20191024',
  assetId:'users/haozhima95/rootshootratio/shrub_rsr_sample_for_grsearch_20191024'
});
