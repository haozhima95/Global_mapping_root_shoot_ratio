# Mechanistic understanding of environmental effect on RMF

#### This folder contains different analysis methods that have been shown in the manuscript (Fig.3 and Extended Data Fig.3, 4, 5 and 6).

**To understand detailed mechanisms of environmental controllers to RMF, see the script:**
  - ['play_with_data.Rmd'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/play_with_data.Rmd) and 
  - ['eight_var_importance.Rmd'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/eight_var_importance.Rmd). These scripts show how to create Fig.3 with additional experiments (Not shown in the manuscript).
  
**To understand how factors interactively influence the variation of RMFs:**
  - ['play_with_data.Rmd'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/play_with_data.Rmd) also provides pipeline to create Extended Data Fig.5, 6 and 7.
  
**In another way, using partial linear regression, we are able to detect the role of each factor via the script:**
  - ['forest_lmer.Rmd'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/forest_lmer.Rmd),
  - ['grass_lmer.Rmd'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/grass_lmer.Rmd) and 
  - ['shrub_lmer.Rmd'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/shrub_lmer.Rmd) to understand the detailed effects. These model results are saved to:
  - ['lmer_results.csv'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/lmer_results.csv) for further plotting by:
  - ['lmer_plotting.Rmd'](https://github.com/haozhima95/Global_mapping_root_shoot_ratio/blob/b73a752ce64a1156585be913adb57c77f6a585d6/RSR_Geospatial_Modeling/RMF_controllers/lmer_plotting.Rmd)
