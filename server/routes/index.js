var sqlite3 = require('sqlite3')
  , util    = require('util');

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
  var db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');

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
  var db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');

  if (req.params.id) {
    db.all(
       //util.format('SELECT id,date,rank FROM BC20 WHERE StockTicker LIKE "%s" ORDER BY rank ASC', req.params.id),
util.format('SELECT date,open,rank FROM BC20_%s_Master ORDER BY date ASC', req.params.id), // if you order by DESC, then everything is reverse chronological 
      function(err, rows) {
        db.close();
        if (err) return res.json(501, { error: err.message });
        res.json(rows);
      });
  } else {
      db.all('SELECT stockticker,COUNT(stockticker) as count_stockticker FROM BC20 GROUP BY stockticker ORDER BY stockticker ASC', function(err, rows) {	//	 db.close();
      if (err) return res.json(501, { error: err.message });
	  res.json(rows);
      });
  }
};
