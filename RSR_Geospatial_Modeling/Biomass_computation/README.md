# Belowground biomass caclulation and summarizing.

#### The RMF map is used as a tool to convert aboveground biomass to belowground biomass in each vegetation type.


**To get the aboveground biomass from IPCC estimation, the scripts named:**
  - ['forest_abovemass.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/forest_abovemass.js), 
  - ['grass_abovemass.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/grass_abovemass.js) and 
  - ['shrub_abovemass.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/shrub_abovemass.js) 
  can be used for converting recent estimation of total biomass carbon to aboveground biomass in each vegetattion type.
  
  
  
  
**To calculate belowground biomass density from rmf maps and aboveground biomass density, the scripts named:**
  - ['forest_belowground_biomass_density.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/forest_belowground_biomass_density.js),
  - ['grass_belowground_biomass_density.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/grass_belowground_biomass_density.js) and 
  - ['shrub_belowground_biomass_density.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/shrub_belowground_biomass_density.js)
  can be applied.
  Also, if you use bootstrapped rmf maps, these scripts would also return a series of belowground biomass density maps:
  - ['forest_bootstrap_belowmass_density.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/forest_bootstrap_belowmass_density.js) and ['forest_bootstrap_belowmass_summary.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/forest_bootstrap_belowmass_summary.js),
  - ['grass_bootstrap_belowmass_density.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/grass_bootstrap_belowmass_density.js), and 
  - ['shrub_bootstrap_belowmass_density.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/shrub_bootstrap_belowmass.js).
  
**To summarize and get the mean and other relevant layers from different biomass density layers from 'xxx_belowground_biomass.js', the scripts named:**
  - ['forest_belowground_biomass_summary.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/forest_belowground_biomass_summary.js),
  - ['grass_belowground_biomass_summary.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/grass_belowground_biomass_summary.js) and 
  - ['shrub_belowground_biomass_summary.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/shrub_belowground_biomass_density_summary.js)
  can be applied.
  
**To calculate the total amount of belowground biomass in different vegetation types, scripts named:**
  - ['forest_belowmass_calcu.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/forest_belowmass_calcu.js),
  - ['grass_belowmass_calcu.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/grass_belowmass_calcu.js) and
  - ['shrub_belowmass_calcu.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/shrub_belowmass_calcu.js)
  can be applied. 
Also if you get the belowground biomass layers from bootstrapped method, you can use:
  - ['forest_bootstrap_belowmass_calculation.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/forest_bootstap_belowmass_calculation.js),
  - ['grass_bootstrap_belowmass_calculation.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/grass_bootstrap_belowmass_calculation.js) and 
  - ['shrub_bootstrap_belowmass_calculation.js'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/72e182345c04966133a1e7053f7609556772b2bb/RSR_Geospatial_Modeling/Biomass_computation/shrub_bootstrap_belowmass_calculation.js).
