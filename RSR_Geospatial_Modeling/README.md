# RSR geospatial modeling

### This folder contains all the geospatially related scripts for the nematode abundance work.

#### Here is an outline describing how you can use these scripts:

1. To aggregate and clean the raw data, you can use the script:
  - "RSR_aggregate_by_coordinates_by_biome.ipynb" to aggreagate the records by spatial coordinate information.
  - "raw_data_clean_after_aggregation.Rmd" to clean the outliers, which are distant from the threshold that we set for each vegetation type in each biome.
2. To sample the layers for further random forest grid search, you can use the script:
  - "rsr_covariates_attach.js" to sample the environmental covariates layers in Google Earth Engine.
3. To do grid search in each vegetation types, you can use the script:
  - "grsearch_h2o.Rmd" to select best random forest models and save the hyperparameters into tables that can be referred into global mapping.
  - "forest_rf_grsearch.js", "grass_rf_grsearch.js" and "shrub_rf_grsearch.js" to create the global maps in different vegetation types. Ten different maps will be created by using differnt saved hyperparameters.
4. To create the final maps and explore the model uncertainties, you can use the script:
  - "rsr_mean_vc.js" to create RSR distribution models and variation coefficient maps, whereas you can also use:
  - "rsr_total_coverage_interpolation.js" to create the maps that indicate the percetage of interpolation versus extrapolation.
5. To calculate belowground biomass density in different vegetation types, you can use the script:
  - "belowmass_density_convert.js" to covert aboveground biomass of each vegetation type using differnt RSR models that have been created by previous scripts.
  - "forest_belowmass_calculation.js", "grass_belowmass_calculation.js" and "shrub_belowmass_calculation.js" to calculate total belowground biomass of different vegetation types.
6. To evaluate random forest model predictions, you can use the script:
- "modelprediction.Rmd" and refer "modelprediction.html".
