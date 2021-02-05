# Root mass fraction data cleaning from raw data to datasets that are ready for model selection.

#### This folder contains scripts that filtering out outliers in each biome in each vegetation type. Sampled by environmental covariates, these datasets will be used for further analyses. 

1. **To eliminate the effect of spatial duplication, you can use the script:**
  - 'RSR_aggregate_by_coordinates_by_biome.ipynb' for aggregating plot informations that falling on the same location.
  
2. **To filter out the outliers of the data in each biome, you can use the script:**
  - 'raw_data_clean_after_aggregation.Rmd' for filtering out outliers in each vegetation type by biome.
  
3. **To sample environmental covariates, you can use the script:**
  - 'rsr_covariates_attach.js' for adding covariate information in Google Earth Engine. The new datasets will be used for further analyses.
