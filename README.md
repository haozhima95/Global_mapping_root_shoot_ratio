# Global_mapping_root_shoot_ratio

## This repository contains the code used for the analysis in the paper "The global biogeography of above- versus belowground plant biomass allocation"

#### The code is organized as follows:

- The folder titled "RSR_Geospatial_Modeling" contains for:
  - Aggregating the raw records by unique coordinate information (script titled RSR_aggregated_by_coordinates_by_biome.ipynb).
  - Cleaning the aggregated data in each biome and vegetation type, filtering the outliers (script titled raw_data_clean_after_aggregation.Rmd).
  - Grid searching and model selection for further global mapping (scripts titled rsr_covariates_attach.txt and grsearch_h2o.Rmd).
  - Creating the maps for RSR distribution and model uncertainties (script titled rsr_covariates_attach.txt, forest_rf_grsearch.txt, grass_rf_grsearch.txt, shrub_rf_grsearch.txt, rsr_mean_vc.txt and rsr_total_coverage_interpolation.txt).
  - Exploring the full model predictions for three vegetation types (scripts titled rsr_gee_model_prediction.txt, modelprediction.Rmd and modelprediction.html).
  - Exploring the maps of belowground biomass density distribution and belowground biomass calculations (scripts titled xxx).

- The folder titled "RSR_Observations" contains data for most of the calculations
  - all raw data
