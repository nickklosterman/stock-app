stock-app
=========

An Awesome Stock App to Quell fiveisprime.

To populate the sqlite database with all applicable data,
you will want to run 
 RefreshStockDataForTickersOnList.sh 
 Scripts / CreateMasterDateRankStockDataAnalysisDatabases.sh
from my IBD repository.

This will run the script and place the historical data in the same database as that 
which called it (recommended);
bash RefreshStockDataForTickersOnList.sh IBDTestDatabaseBC20.sqlite IBDTestDatabaseBC20.sqlite 
