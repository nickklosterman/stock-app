var sqlite3 = require('sqlite3')
  , util    = require('util');
var sqlite_database="";


function compute_percentage_growth(rows) {
  //check since sometimes some records missing from database
  if ( typeof rows !== undefined && typeof rows[0] !== 'undefined') {
     var initialvalue = (rows[0]).Open;

     for (var counter = 0; counter < rows.length; counter++) {
       var item = rows[counter];
       item.percentage_growth = ((item.Open-initialvalue) / initialvalue * 100).toFixed(2);
     }
  }
}

//
// Render the index view.
//
exports.index = function(req, res) {
  res.render('index');
};

//
// Get data for all dates or specific date data if specified.
//
exports.dates = function(req, res) {
//  var db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');
//var db = new sqlite3.Database('IBDdatabase.sqlite');
  //  console.log("exports.dates using:"+sqlite_database);
   var db = new sqlite3.Database(sqlite_database);
  if (req.params.date) {
    db.all(
      util.format('SELECT rank,stockticker from BC20 where Date="%s" order by Rank Asc', req.params.date),
      function(err, rows) {
        db.close();
        if (err) return res.json(501, { error: err.message });
        res.json(rows);
      });
  } else {
    db.all('SELECT distinct(date) from BC20', function(err, rows) {
      db.close();
      if (err) return res.json(501, { error: err.message });
      res.json(rows);
    });
  }
};

//
// Get all stock data.
//
exports.stocks = function(req, res) {
  //var db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');
//var db = new sqlite3.Database('IBDdatabase.sqlite');
//    console.log("exports.stocks using:"+sqlite_database);
   var db = new sqlite3.Database(sqlite_database);
    var table = "BC20";
  if (req.params.id) {
    db.all(
//      util.format('SELECT date,open,rank FROM BC20_%s_Master ORDER BY date ASC', req.params.id)
      util.format('SELECT date,open,rank FROM '+table+'_%s_Master WHERE date >= ( SELECT min(date) from '+table+'_%s_Master WHERE rank > 0 and  date >= "2013-01-01" and date < "2013-12-31"  ) ORDER BY date ASC', req.params.id, req.params.id),
      //util.format('SELECT date,open,rank FROM BC20_%s_Master WHERE date > "2013-05-01" ', req.params.id), //WORKS
	//util.format('SELECT date,open,rank FROM BC20_%s_Master WHERE date > "%s" ', req.params.id,"2013-04-15"), //WORKS

      function(err, rows) {
        db.close();
        if (err) return res.json(501, { error: err.message });
        compute_percentage_growth(rows);
        res.json(rows);
      });

  } else {
    db.all(
//      'SELECT stockticker,COUNT(stockticker) as count_stockticker FROM BC20 GROUP BY stockticker ORDER BY stockticker ASC',
      'SELECT stockticker,COUNT(stockticker) as count_stockticker FROM BC20 WHERE date >= "2013-01-01" and date < "2013-12-31" GROUP BY stockticker ORDER BY stockticker ASC',
      function(err, rows) {
        db.close();
        if (err) return res.json(501, { error: err.message });
        res.json(rows);
      });
  }
};

//http://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module
//https://www.google.com/search?q=exports.module
module.exports = function(app,db) { 
sqlite_database=db;
console.log(sqlite_database+",db: "+db);
app.get('/', exports.index);
app.get('/api/stocks/:id?', exports.stocks);
};
