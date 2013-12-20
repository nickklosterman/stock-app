var sqlite3 = require('sqlite3')
  , debug   = require('debug')('router')
  , util    = require('util');

var execSql = function(sql, res, view, opt) {
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
  execSql('SELECT DISTINCT(stockticker) FROM BC20 ORDER BY stockticker ASC', res, 'index');
};

//
// Get data for all dates or specific date data if specified.
//
exports.dates = function(req, res) {
  if (req.params.date) {
    execSql(
      util.format('SELECT rank,stockticker from BC20 where Date="%s" order by Rank Asc', req.params.date)
    , res
    , 'date-rank-list');
  } else {
    execSql('SELECT distinct(date) from BC20', res, 'datesindex');
  }
};

exports.detail = function(req, res) {
  execSql(
    util.format('SELECT id,date,rank FROM BC20 WHERE StockTicker LIKE "%s" ORDER BY rank ASC', req.params.id)
  , res
  , 'detail'
  , { ticker: req.params.id });
};
