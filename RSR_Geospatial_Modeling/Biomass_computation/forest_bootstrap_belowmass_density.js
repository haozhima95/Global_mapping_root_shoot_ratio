// This script is used for updating the belowground biomass layers of trees

// Load the data

// Set the worldwide polygon.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

// Set the rout path

var st = 'your/directory';
// AgB

var treeagb = ee.Image('abovetreebiomass_20200501');



// Make a list of seeds to use for the bootstrapping
function JSsequence(i) {
	return i ? JSsequence(i - 1).concat(i) : []
}
var numberOfSubsets = 100;
var seedsForBootstrapping = JSsequence(numberOfSubsets);



// Input a base image name for exporting and organizational purposes
var bootstrapFileName = 'forest_rmf_Bootstrap_';

// Load the bootstrap function
//var bootStrap = require('users/devinrouth/toolbox:Stratified_Bootstrap_FeatureCollection.js');

// Make a function to pad numbers with leading zeroes for formatting purposes
function pad(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}





// Loop

// for(var i = 1; i< 11; i++){
seedsForBootstrapping.map(function(seedToUse){
  // load the rsr layers.
  var rsr = ee.Image(st+'forest_rmf_Bootstrap_'+pad(seedToUse,2));
      rsr = rsr.divide(ee.Image(100).subtract(rsr));
      //Map.addLayer(rsr);
  // Get the belowground biomass density.
  var bgb = treeagb.multiply(rsr);
  
  // Mask the layer
      // bgb = bgb.mask(rsr);
      // bgb = bgb.updateMask(1);
      //Map.addLayer(bgb);
  // Export the layer
  Export.image.toAsset({
    image:bgb,
    description:'forest_belowground_biomass_density_'+pad(seedToUse,2),
    assetId:st+'forest_belowmass_boot/forest_boot_belowground_biomass_density_'+pad(seedToUse, 2),
    region: unboundedGeo,
    crs:'EPSG:4326',
    crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	  maxPixels: 1e13
  });
  
});


