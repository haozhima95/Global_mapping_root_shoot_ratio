// This script is used to calculate abovebiomass from IPCC information in shrublands.

// This aboveground biomass is used for further conversion to belowground biomass density per pixel in shrublands.



var shrubmass = ee.Image("users/haozhima95/shrubmass_20200501");

// As the IPCC report coarsely provided the converting factor information, we hereby convert by tropical, subtropcial, and the rest regions.

var tropic = ee.Geometry.Polygon([-180, 23.4366667, 0, 23.436667, 180, 23.436667, 180, -23.4366667, 0, -23.4366667, -180, -23.4366667], null, false);


var nsubtropic = ee.Geometry.Polygon([-180, 35, 0, 35, 180, 35, 180, 23.4366667, 0, 23.4366667, -180, 23.436667], null, false);

var ssubtropic = ee.Geometry.Polygon([-180, -23.4366667, 0, -23.4366667, 180, -23.4366667, 180, -35, 0, -35, -180, -35], null, false);


var nrest = ee.Geometry.Polygon([-180, 85, 0, 85, 180, 85, 180, 35, 0, 35, -180, 35], null, false);

var srest = ee.Geometry.Polygon([-180, -35, 0, -35, 180, -35, 180, -88, 0, -88, -180, -88], null, false);

// Converting into aboveground biomass.

var tropicbiomass = shrubmass.clip(tropic);
//var tropicratio = shrubmass.clip(tropic);
    tropicbiomass = tropicbiomass.divide(1.4);
    tropicbiomass = tropicbiomass.reproject({
      crs:shrubmass.projection()
    });
    
Map.addLayer(tropicbiomass);



var nsubbiomass = shrubmass.clip(nsubtropic);
//var subratio = shrubmass.clip(nsubtropic);
    nsubbiomass = nsubbiomass.divide(1.32);
    nsubbiomass = nsubbiomass.reproject({
      crs:shrubmass.projection()
    });
Map.addLayer(nsubbiomass);



var ssubbiomass = shrubmass.clip(ssubtropic);
//var subratio = shrubmass.clip(ssubtropic);
    ssubbiomass = ssubbiomass.divide(1.32);
    ssubbiomass = ssubbiomass.reproject({
      crs:shrubmass.projection()
    });
Map.addLayer(ssubbiomass);

var nrestbiomass = shrubmass.clip(nrest);
var nrestratio = shrubmass.clip(nrest);
    nrestbiomass = nrestbiomass.divide(2.837);
    nrestbiomass = nrestbiomass.reproject({
      crs:shrubmass.projection()
    });
Map.addLayer(nrestbiomass);


var srestbiomass = shrubmass.clip(srest);
//var srestratio = shrubmass.clip(srest);
    srestbiomass = srestbiomass.divide(2.837);
    srestbiomass = srestbiomass.reproject({
      crs:shrubmass.projection()
    });
Map.addLayer(srestbiomass);

var all_mass = ee.ImageCollection([tropicbiomass,nsubbiomass,ssubbiomass,nrestbiomass,srestbiomass]);
    all_mass = all_mass.mosaic();
    all_mass = all_mass.reproject({
      crs:shrubmass.projection()
    });
Map.addLayer(all_mass);

// Outputting.
var unboundedGeo = ee.Geometry.Polygon([-180, 88, 0, 88, 180, 88, 180, -88, 0, -88, -180, -88], null, false);

Export.image.toAsset({
	image: all_mass,
	description: 'aboveshrubbiomass_20200501',
	region: unboundedGeo,
  crs:'EPSG:4326',
  crsTransform:[0.008333333333333333,0,-180,0,-0.008333333333333333,90],
	maxPixels: 1e13
});
