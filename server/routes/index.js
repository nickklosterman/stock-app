var sqlite3 = require('sqlite3')
  , util    = require('util');

function compute_percentage_growth(rows) {
  var initialvalue = (rows[0]).Open;

  for (var counter = 0; counter < rows.length; counter++) {
    var item = rows[counter];
    item.percentage_growth = ((item.Open-initialvalue) / initialvalue * 100).toFixed(2);
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
      util.format('SELECT date,open,rank FROM BC20_%s_Master ORDER BY date ASC', req.params.id),
      function(err, rows) {
        db.close();
        if (err) return res.json(501, { error: err.message });

        compute_percentage_growth(rows);
        res.json(rows);
      });
  } else {
    db.all(
      'SELECT stockticker,COUNT(stockticker) as count_stockticker FROM BC20 GROUP BY stockticker ORDER BY stockticker ASC',
      function(err, rows) {
        db.close();
        if (err) return res.json(501, { error: err.message });
        res.json(rows);
      });
  }
};
