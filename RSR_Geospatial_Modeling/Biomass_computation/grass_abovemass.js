// This script is used to calculate abovebiomass from IPCC information in grassland.

// This aboveground biomass is used for further conversion to belowground biomass density per pixel in grassland.

// Load ecozone data and grassland pixel level biomass density (aboveground + belowground).
var eco_zone = ee.FeatureCollection("users/haozhima95/eco_zone"),
    grassmass = ee.Image("users/haozhima95/grassmass_20200501");
    
  Map.addLayer(grassmass);
  // Filter the ecozones. Filter out water and ocean.
  eco_zone = eco_zone.filterMetadata('ECO_ZONE_I','not_equals',13389);
  eco_zone = eco_zone.filterMetadata('GEZ_TERM','not_equals','Water');
  eco_zone = eco_zone.filterMetadata('GEZ_TERM','not_equals','No data');
Map.addLayer(eco_zone);

// For each eco zone, there is a fixed ratio of aboveground-total biomass ratio.
var ll = eco_zone.aggregate_array('GEZ_TERM');
    ll = ee.List(ll);
    ll = ll.distinct();
print(ll);

var ls = [2.6,3.8,2.6,3.8,3.8,3.8,3.8,3.8,5,3.8,3.8,3.8,3.8,2.6,5,5,3.8,5,5,5];
    ls = ee.List(ls);
    print(ls);
    
// Create an empty list.
var grassabovelist = [];
    grassabovelist = ee.List(grassabovelist);


// Loop the ecozones, and convert to aboveground biomass
for(var i = 0; i<20; i++){
  var num = ls.get(i);
      num = ee.Number(num);
  var region = eco_zone.filterMetadata('GEZ_TERM','equals',ll.get(i));
  var grassm = grassmass.clip(region);
      grassm = grassm.divide(num);
      grassm = grassm.reproject({
        crs:grassm.projection()
      });
      grassabovelist = grassabovelist.add(grassm);
}

var grassmm = ee.ImageCollection(grassabovelist);
    grassmm = grassmm.mosaic();
    Map.addLayer(grassmm);
    
//Output the image to personal asset.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

Export.image.toAsset({
	image: grassmm,
	description: 'abovegrassbiomass_20200501',
	region: unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});
    
