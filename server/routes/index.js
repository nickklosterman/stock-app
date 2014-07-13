var sqlite3 = require('sqlite3')
  , util    = require('util');

var sqlite_database=""
, database_table=""
, query_year=2013;

function compute_percentage_growth(rows) {
  //check since sometimes some records missing from database
  if ( typeof rows !== undefined && typeof rows[0] !== 'undefined') {

//Get the initial value. Assumes data is sorted by date asc
     var initialvalue = (rows[0]).Open;
   var initialvalueSP500 = (rows[0]).SP500Open;

     for (var counter = 0; counter < rows.length; counter++) {
       var item = rows[counter];
       item.percentage_growth = ((item.Open-initialvalue) / initialvalue * 100).toFixed(2);
       item.percentage_growthSP500 = ((item.SP500Open-initialvalueSP500) / initialvalueSP500 * 100).toFixed(2);
//	 console.log(item.percentage_growth+' '+item.percentage_growthSP500);
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
  //  console.log("exports.dates using:"+sqlite_database);
   var db = new sqlite3.Database(sqlite_database);
  if (req.params.date) {
    db.all(
      util.format('SELECT rank,stockticker from '+database_table+' where Date="%s" order by Rank Asc', req.params.date),
      function(err, rows) {
        db.close();
        if (err) return res.json(501, { error: err.message });
        res.json(rows);
      });
  } else {
    db.all('SELECT distinct(date) from '+database_table, function(err, rows) {
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

   var db = new sqlite3.Database(sqlite_database);

var id=(req.params.id || "aapl")
//, database_table=(req.params.table || "IBD50")
//, year=(req.params.year || 2014);
, year=(req.params.year || query_year);

    console.log("exports.stocks using:"+sqlite_database+" and table:"+database_table+" and year:"+year);

  if (req.params.id) {
console.log('SELECT '+database_table+'_'+id+'_Master.Date, '+database_table+'_'+id+'_Master.Open, '+database_table+'_'+id+'_Master.Rank, '+database_table+'_'+id+'_Master.High, '+database_table+'_'+id+'_Master.Low, '+database_table+'_'+id+'_Master.Close, '+database_table+'_'+id+'_Master.Volume, '+database_table+'_'+id+'_Master.Adj_Close, _GSPC.Open as SP500Open, _GSPC.High as SP500High , _GSPC.Low as SP500Low , _GSPC.Close as SP500Close , _GSPC.Volume as SP500Volume , _GSPC.Adj_Close as SP500Adj_Close  FROM '+database_table+'_'+id+'_Master INNER JOIN _GSPC ON '+database_table+'_'+id+'_Master.Date =  _GSPC.Date WHERE '+database_table+'_'+id+'_Master.date >= (select min('+database_table+'_'+id+'_Master.date) from '+database_table+'_'+id+'_Master where '+database_table+'_'+id+'_Master.rank > 0 and '+database_table+'_'+id+'_Master.date >="'+year+'-01-01" and '+database_table+'_'+id+'_Master.date < "'+year+'-12-31" ) ORDER BY '+database_table+'_'+id+'_Master.Date ASC')

    db.all(
//      util.format('SELECT date,open,rank FROM BC20_%s_Master ORDER BY date ASC', req.params.id)
//      util.format('SELECT date,open,rank FROM '+database_table+'_%s_Master WHERE date >= ( SELECT min(date) from '+database_table+'_%s_Master WHERE rank > 0 and  date >= "2013-01-01" and date < "2013-12-31"  ) ORDER BY date ASC', req.params.id, req.params.id),

//limit on upper and lower date
//util.format('SELECT '+database_table+'_'+id+'_Master.Date, '+database_table+'_'+id+'_Master.Open, '+database_table+'_'+id+'_Master.Rank, '+database_table+'_'+id+'_Master.High, '+database_table+'_'+id+'_Master.Low, '+database_table+'_'+id+'_Master.Close, '+database_table+'_'+id+'_Master.Volume, '+database_table+'_'+id+'_Master.Adj_Close, _GSPC.Open as SP500Open, _GSPC.High as SP500High , _GSPC.Low as SP500Low , _GSPC.Close as SP500Close , _GSPC.Volume as SP500Volume , _GSPC.Adj_Close as SP500Adj_Close  FROM '+database_table+'_'+id+'_Master INNER JOIN _GSPC ON '+database_table+'_'+id+'_Master.Date =  _GSPC.Date WHERE '+database_table+'_'+id+'_Master.date >= (select min('+database_table+'_'+id+'_Master.date) from '+database_table+'_'+id+'_Master where '+database_table+'_'+id+'_Master.rank > 0 and '+database_table+'_'+id+'_Master.date >="'+year+'-01-01" and '+database_table+'_'+id+'_Master.date < "'+year+'-12-31" ) ORDER BY '+database_table+'_'+id+'_Master.Date ASC'),

//no limit on upper date
util.format('SELECT '+database_table+'_'+id+'_Master.Date, '+database_table+'_'+id+'_Master.Open, '+database_table+'_'+id+'_Master.Rank, '+database_table+'_'+id+'_Master.High, '+database_table+'_'+id+'_Master.Low, '+database_table+'_'+id+'_Master.Close, '+database_table+'_'+id+'_Master.Volume, '+database_table+'_'+id+'_Master.Adj_Close, _GSPC.Open as SP500Open, _GSPC.High as SP500High , _GSPC.Low as SP500Low , _GSPC.Close as SP500Close , _GSPC.Volume as SP500Volume , _GSPC.Adj_Close as SP500Adj_Close  FROM '+database_table+'_'+id+'_Master INNER JOIN _GSPC ON '+database_table+'_'+id+'_Master.Date =  _GSPC.Date WHERE '+database_table+'_'+id+'_Master.date >= (select min('+database_table+'_'+id+'_Master.date) from '+database_table+'_'+id+'_Master where '+database_table+'_'+id+'_Master.rank > 0 and '+database_table+'_'+id+'_Master.date >="'+year+'-01-01" ) ORDER BY '+database_table+'_'+id+'_Master.Date ASC'),

//      util.format('SELECT date,open,rank FROM %s_%s_Master WHERE date >= ( SELECT min(date) from %s_%s_Master WHERE rank > 0 and  date >= "%s-01-01" and date < "%s-12-31"  ) ORDER BY date ASC',table, id, table, id, year, year),
      //util.format('SELECT date,open,rank FROM BC20_%s_Master WHERE date > "2013-05-01" ', req.params.id), //WORKS
	//util.format('SELECT date,open,rank FROM BC20_%s_Master WHERE date > "%s" ', req.params.id,"2013-04-15"), //WORKS

      function(err, rows) {
        db.close();
        if (err) {
	    console.log(err);
	    return res.json(501, { error: err.message });
	};
	  console.log(rows.length+" rows returned by query");
        compute_percentage_growth(rows);
        res.json(rows);
      });

  } else {
console.log(util.format('SELECT stockticker,COUNT(stockticker) as count_stockticker FROM %s WHERE date >= "%s-01-01" and date < "%s-12-31" and rank > 0  GROUP BY stockticker ORDER BY stockticker ASC',database_table,year,year))
    db.all(
	util.format('SELECT stockticker,COUNT(stockticker) as count_stockticker FROM %s WHERE date >= "%s-01-01" and date < "%s-12-31" and rank > 0  GROUP BY stockticker ORDER BY stockticker ASC',database_table,year,year),
      function(err, rows) {
        db.close();
        if (err) { console.log(err);  return res.json(501, { error: err.message });}
        res.json(rows);
      });
  }
};

//http://stackoverflow.com/questions/13151693/passing-arguments-to-require-when-loading-module
//https://www.google.com/search?q=exports.module
module.exports = function(app,db,table,year) { 
sqlite_database=db;
database_table=table;
query_year=year;
console.log(sqlite_database+",db: "+db);
app.get('/', exports.index);
app.get('/api/stocks/:id?', exports.stocks);
app.get('/api/stocks/:table/:year/:id?',exports.stocks);
};


