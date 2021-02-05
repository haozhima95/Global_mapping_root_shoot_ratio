
# Geospatial mapping

#### This folder contains scripts that are used for training random forest machine learning models.


- The script named 'grsearch_rmf.rmd' contains the script that can be run for grid-searching approach. This approach allows users to get the best models with combinations of hyperparamters. 

- The file named 'forest_rfgrsearch_r2_20200517.csv', 'grass_rfgrsearch_r2_20200517.csv' and 'grass_rfgrsearch_r2_20200517.csv' contains the grid-search results from the file 'grsearch_rmf.rmd'.

- The file named 'forest_rf_grsearch.js', 'grass_rf_grsearch.js' and 'shrub_rf_grsearch.js' shall be run in Google Earth Engine to get the maps from the best ten models in each vegetation type.

- The file named 'rmf_aggregate_summary.js' can be run in Google Earth Engine to summarize the layers you produced via 'forest_rf_grsearch.js', 'grass_rf_grsearch.js' and 'shrub_rf_grsearch.js' files. Thus you'll get a summarized mean, std, min and max layer for each vegetation type.

- The file named 'BlockedLeaveOneOut.ipynb' is used for spatial cross validation, which is a way to check the effect of spatial autocorrelation on model predictive power. The basic idea is to filter out all but one point within the bufferzone. The point remains in the buffer zone is regarded as testing data whereas the points falling out of the buffer zone are used as training data. Iterating through all the sample points, we are able to get the raw data and the predictive data for each sample point. 

- To evaluate the model uncertainty, we use the script 'rsr_total_coverage_interpolation.js' to assess the coverage of sampling points on environmental covariates. Using a principal component analysis on the matrix of predictor value and using PCA axes to generate the convex-hull, we create a evaluation of predictor coverage by taking interactions betweeen predictors into account. This analysis is shown in 'PCA_ConvexHull_IntExt_Code.ipynb'. 
