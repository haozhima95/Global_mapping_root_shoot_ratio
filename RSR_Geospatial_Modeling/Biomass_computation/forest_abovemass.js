// This script is used to calculate abovebiomass from IPCC information in forests.

// This aboveground biomass is used for further conversion to belowground biomass density per pixel in forests.

// Load ecozone data and forest pixel level biomass density (aboveground + belowground).

var eco_zone = ee.FeatureCollection("users/haozhima95/eco_zone"),
    treemass = ee.Image("users/haozhima95/treemass_20200501");
    
//ecozone
// Filter the ecozones. Filter out water and ocean.
  eco_zone = eco_zone.filterMetadata('ECO_ZONE_I','not_equals',13389);
  eco_zone = eco_zone.filterMetadata('GEZ_TERM','not_equals','Water');
  eco_zone = eco_zone.filterMetadata('GEZ_TERM','not_equals','No data');    
  
  Map.addLayer(treemass);
// For each eco zone, there is a fixed ratio of aboveground total biomass ratio.
var ll = eco_zone.aggregate_array('GEZ_TERM');
    ll = ee.List(ll);
    ll = ll.distinct();
print(ll);

//treeconvert
var ls = [1.37,1.27,1.24,1.28,1.28,1.27,1.28,1.28,1.26,1.26,1.28,1.33,1.28,1.24,1.39,1.33,1.33,1.39,1.39,1.39]; // These converting number refer to IPCC reports.
    ls = ee.List(ls);
print(ls);
// Create an empty list.
var abovelist = [];
    abovelist = ee.List(abovelist); 
// Loop the ecozones, and convert to aboveground biomass.
for(var i = 0; i<20; i++){
  var num = ls.get(i);
      num = ee.Number(num);
      //print(num);
  var region = eco_zone.filterMetadata('GEZ_TERM','equals',ll.get(i));
  //print(region);
  var biomass = treemass.clip(region);
  
  var abovetreemass = biomass.divide(num);
      abovetreemass = abovetreemass.reproject({
        crs:abovetreemass.projection()
      });
  abovelist = abovelist.add(abovetreemass);
}

var abovemass = ee.ImageCollection(abovelist);
    abovemass = abovemass.mosaic();
    //print(abovemass)
Map.addLayer(abovemass);
// Outputting.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);


Export.image.toAsset({
	image: abovemass,
	description: 'abovetreebiomass_20200501',
	region: unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});
