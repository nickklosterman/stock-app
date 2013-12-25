var sqlite3 = require('sqlite3')
  , debug   = require('debug')('router')
  , util    = require('util');

//
// Execute the SQL statement against the local database and render the result.
//
var execSqlRender = function(sql, res, view, opt) {
  debug('executing SQL: %s', sql);
  var db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');

  db.all(sql, function(err, rows) {
    debug('SQL execution complete.');
    db.close();

    if (err) return res.render(view, { error: err.message });
    res.render(view, util._extend({ data: rows }, opt));
  });
};

//
// Get all ordered
//
exports.index = function(req, res) {
  res.render('index');
};

//
// Get data for all dates or specific date data if specified.
//
exports.dates = function(req, res) {
  if (req.params.date) {
    execSqlRender(
      util.format('SELECT rank,stockticker from BC20 where Date="%s" order by Rank Asc', req.params.date)
    , res
    , 'date-rank-list');
  } else {
    execSqlRender('SELECT distinct(date) from BC20', res, 'datesindex');
  }
};

exports.stocks = function(req, res) {
  var db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');

  if (req.params.id) {
    db.all(
      util.format('SELECT id,date,rank FROM BC20 WHERE StockTicker LIKE "%s" ORDER BY rank ASC', req.params.id),
      function(err, rows) {
        if (err) return res.json(501, { error: err.message });
        res.json(rows);
      });
  } else {
    db.all('SELECT stockticker,COUNT(stockticker) as count_stockticker FROM BC20 GROUP BY stockticker ORDER BY stockticker ASC', function(err, rows) {
      db.close();
      if (err) return res.json(501, { error: err.message });
      res.json(rows);
    });
  }
};
