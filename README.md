stock-app
=========

An Awesome Stock App to Quell fiveisprime.

To populate the sqlite database with all applicable data,
you will want to run

    RefreshStockDataForTickersOnList.sh
    Scripts / CreateMasterDateRankStockDataAnalysisDatabases.sh

from my IBD repository.

This will run the script and place the historical data in the same database as
that which called it (recommended);

    bash RefreshStockDataForTickersOnList.sh IBDTestDatabaseBC20.sqlite IBDTestDatabaseBC20.sqlite

# Structure

All public assets are in the `public` directory; note that the vendor libraries
are concatenated into the `app.min.js` which is used when the application is run
in production mode.

# Building

This application uses [gulp](http://gulpjs.com/) to process files. The following
`gulp` tasks exist:

 * `lint`
   * Runs JSHint on all JavaScript files (both client and server)
 * `build`
   * Concatenates and minifies the client-side JavaScript into `app.min.js`

_Note: the default gulp task will only run `lint`._

# Running

`npm start` will run the application in development mode. To run in production
mode, run `NODE_ENV=production node index`. The express error handler will not
be used in production mode and the minified client-side JavaScript will be used
in place of `app.js`.
