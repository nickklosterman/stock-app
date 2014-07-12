var sqlite3 = require('sqlite3')
  , util    = require('util');

var sqlite_database="";
var database_table="";
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
//  var db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');
//var db = new sqlite3.Database('IBDdatabase.sqlite');
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

// var id=(req.params.id || "aapl")
// , dattable=(req.params.table || "IBD50")
// , year=(req.params.year || 2014);

//    var table = database_table;//"BC20";//"IBD50";//"BC20";
    console.log("exports.stocks using:"+sqlite_database+" and table:"+database_table);
  if (req.params.id) {
    db.all(
//      util.format('SELECT date,open,rank FROM BC20_%s_Master ORDER BY date ASC', req.params.id)
//      util.format('SELECT date,open,rank FROM '+database_table+'_%s_Master WHERE date >= ( SELECT min(date) from '+database_table+'_%s_Master WHERE rank > 0 and  date >= "2013-01-01" and date < "2013-12-31"  ) ORDER BY date ASC', req.params.id, req.params.id),
//util.format('SELECT '+database_table+'_%s_Master.Date, '+database_table+'_%s_Master.Open, '+database_table+'_%s_Master.High, '+database_table+'_%s_Master.Low, '+database_table+'_%s_Master.Close, '+database_table+'_%s_Master.Volume, '+database_table+'_%s_Master.Adj_Close, _GSPC.Open as SP500Open, _GSPC.High as SP500High , _GSPC.Low as SP500Low , _GSPC.Close as SP500Close , _GSPC.Volume as SP500Volume , _GSPC.Adj_Close as SP500Adj_Close  FROM '+database_table+'_%s_Master INNER JOIN _GSPC ON '+database_table+'_%s_Master.Date =  _GSPC.Date WHERE '+database_table+'_%s_Master.date >= (select min('+database_table+'_%s_Master.date) from '+database_table+'_%s_Master where '+database_table+'_%s_Master.rank > 0 and '+database_table+'_%s_Master.date >="2013-01-01" and '+database_table+'_%s_Master.date < "2013-12-31" ) ORDER BY '+database_table+'_%s_Master.Date ASC', req.params.id, req.params.id),
util.format('SELECT BC20_PCLN_Master.Date, BC20_PCLN_Master.Open, BC20_PCLN_Master.High, BC20_PCLN_Master.Low, BC20_PCLN_Master.Close, BC20_PCLN_Master.Volume, BC20_PCLN_Master.Adj_Close, _GSPC.Open as SP500Open, _GSPC.High as SP500High , _GSPC.Low as SP500Low , _GSPC.Close as SP500Close , _GSPC.Volume as SP500Volume , _GSPC.Adj_Close as SP500Adj_Close  FROM BC20_PCLN_Master INNER JOIN _GSPC ON BC20_PCLN_Master.Date =  _GSPC.Date WHERE BC20_PCLN_Master.date >= (select min(BC20_PCLN_Master.date) from BC20_PCLN_Master where BC20_PCLN_Master.rank > 0 and BC20_PCLN_Master.date >="2013-01-01" and BC20_PCLN_Master.date < "2013-12-31" ) ORDER BY BC20_PCLN_Master.Date ASC'),
  console.log("exports.stocks using:"+sqlite_database+" and table:"+table);

      util.format('SELECT date,open,rank FROM %s_%s_Master WHERE date >= ( SELECT min(date) from %s_%s_Master WHERE rank > 0 and  date >= "%s-01-01" and date < "%s-12-31"  ) ORDER BY date ASC',table, id, table, id, year, year),


      //util.format('SELECT date,open,rank FROM BC20_%s_Master WHERE date > "2013-05-01" ', req.params.id), //WORKS
	//util.format('SELECT date,open,rank FROM BC20_%s_Master WHERE date > "%s" ', req.params.id,"2013-04-15"), //WORKS

      function(err, rows) {
        db.close();
        if (err) {
	    console.log(err);
	    return res.json(501, { error: err.message });
	};
        compute_percentage_growth(rows);
        res.json(rows);
      });

  } else {
    db.all(
//      'SELECT stockticker,COUNT(stockticker) as count_stockticker FROM BC20 GROUP BY stockticker ORDER BY stockticker ASC',
//      'SELECT stockticker,COUNT(stockticker) as count_stockticker FROM '+database_table+' WHERE date >= "2013-01-01" and date < "2013-12-31" GROUP BY stockticker ORDER BY stockticker ASC',
//      'SELECT stockticker,COUNT(stockticker) as count_stockticker FROM BC20 WHERE date >= "2013-01-01" and date < "2013-12-31" GROUP BY stockticker ORDER BY stockticker ASC',
      util.format('SELECT stockticker,COUNT(stockticker) as count_stockticker FROM %s WHERE date >= "%s-01-01" and date < "%s-12-31" GROUP BY stockticker ORDER BY stockticker ASC',table,year,year),
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


/*

SELECT '+database_table+'_%s_Master.Date, '+database_table+'_%s_Master.Open, '+database_table+'_%s_Master.High, '+database_table+'_%s_Master.Low, '+database_table+'_%s_Master.Close, '+database_table+'_%s_Master.Volume, '+database_table+'_%s_Master.Adj_Close, GSPC.Open as SP500Open, GSPC.High as SP500High , GSPC.Low as SP500Low , GSPC.Close as SP500Close , GSPC.Volume as SP500Volume , GSPC.Adj_Close as SP500Adj_Close  FROM '+database_table+'_%s_Master INNER JOIN GSPC ON '+database_table+'_%s_Master.Date =  GSPC.Date WHERE '+database_table+'_%s_Master.date >= (select min('+database_table+'_%s_Master.date) from '+database_table+'_%s_Master where '+database_table+'_%s_Master.rank > 0 and '+database_table+'_%s_Master.date >='2013-01-01' and '+database_table+'_%s_Master.date < '2013-12-31' ) ORDER BY '+database_table+'_%s_Master.Date ASC;

select IBD50_YY_Master.Date, IBD50_YY_Master.Open, IBD50_YY_Master.High, IBD50_YY_Master.Low, IBD50_YY_Master.Close, IBD50_YY_Master.Volume, IBD50_YY_Master.Adj_Close, IBD50_WWWW_Master.Open as SP500Open, IBD50_WWWW_Master.High as SP500High , IBD50_WWWW_Master.Low as SP500Low , IBD50_WWWW_Master.Close as SP500Close , IBD50_WWWW_Master.Volume as SP500Volume , IBD50_WWWW_Master.Adj_Close as SP500Adj_Close  from IBD50_YY_Master inner join IBD50_WWWW_Master on IBD50_YY_Master.Date =  IBD50_WWWW_Master.Date where IBD50_YY_Master.date >= (select min(IBD50_YY_Master.date) from IBD50_YY_Master where IBD50_YY_Master.rank > 0 and IBD50_YY_Master.date >='2013-01-01' and IBD50_YY_Master.date < '2013-12-31' ) order by IBD50_YY_Master.Date asc;  # works!!!

select IBD50_YY_Master.Date, IBD50_YY_Master.Open, IBD50_YY_Master.High, IBD50_YY_Master.Low, IBD50_YY_Master.Close, IBD50_YY_Master.Volume, IBD50_YY_Master.Adj_Close, IBD50_WWWW_Master.Open as SP500Open, IBD50_WWWW_Master.High as SP500High , IBD50_WWWW_Master.Low as SP500Low , IBD50_WWWW_Master.Close as SP500Close , IBD50_WWWW_Master.Volume as SP500Volume , IBD50_WWWW_Master.Adj_Close as SP500Adj_Close  from IBD50_YY_Master inner join IBD50_WWWW_Master on IBD50_YY_Master.Date =  IBD50_WWWW_Master.Date where IBD50_YY_Master.date >= (select min(IBD50_YY_Master.date) from IBD50_YY_Master where IBD50_YY_Master.rank > 0 and IBD50_YY_Master.date >='2013-01-01' and IBD50_YY_Master.date < '2013-12-31' ) order by IBD50_YY_Master.Date asc;

Attempt to perform query to perform a join on the data with the sp500 data to show performance alongside sp500
create table ?? as select %s.Date, %s.Open, %s.High, %s.Low, %s.Close, %s.Volume, %s.Adj_Close,
 GSPC.Open as SP500Open, GSPC.High as SP500High , GSPC.Low as SP500Low , GSPC.Close as SP500Close , GSPC.Volume as SP500Volume , GSPC.Adj_Close as
 SP500Adj_Close from %s inner join GSPC on %s.Date =  GSPC.Date;

create table Waht as select IBD50_YY_Master.Date, IBD50_YY_Master.Open, IBD50_YY_Master.High, IBD50_YY_Master.Low, IBD50_YY_Master.Close, IBD50_YY
_Master.Volume, IBD50_YY_Master.Adj_Close, IBD50_WWWW_Master.Open as SP500Open, IBD50_WWWW_Master.High as SP500High , IBD50_WWWW_Master.Low as SP5
00Low , IBD50_WWWW_Master.Close as SP500Close , IBD50_WWWW_Master.Volume as SP500Volume , IBD50_WWWW_Master.Adj_Close as SP500Adj_Close from IBD50
_YY_Master inner join IBD50_WWWW_Master on IBD50_YY_Master.Date =  IBD50_WWWW_Master.Date;


select IBD50_YY_Master.Date, IBD50_YY_Master.Open, IBD50_YY_Master.High, IBD50_YY_Master.Low, IBD50_YY_Master.Close, IBD50_YY_Master.Volume, IBD50
_YY_Master.Adj_Close, IBD50_WWWW_Master.Open as SP500Open, IBD50_WWWW_Master.High as SP500High , IBD50_WWWW_Master.Low as SP500Low , IBD50_WWWW_Ma
ster.Close as SP500Close , IBD50_WWWW_Master.Volume as SP500Volume , IBD50_WWWW_Master.Adj_Close as SP500Adj_Close from IBD50_YY_Master inner join
 IBD50_WWWW_Master on IBD50_YY_Master.Date =  IBD50_WWWW_Master.Date;

select IBD50_YY_Master.Date, IBD50_YY_Master.Open, IBD50_YY_Master.High, IBD50_YY_Master.Low, IBD50_YY_Master.Close, IBD50_YY_Master.Volume, IBD50
_YY_Master.Adj_Close, IBD50_WWWW_Master.Open as SP500Open, IBD50_WWWW_Master.High as SP500High , IBD50_WWWW_Master.Low as SP500Low , IBD50_WWWW_Ma
ster.Close as SP500Close , IBD50_WWWW_Master.Volume as SP500Volume , IBD50_WWWW_Master.Adj_Close as SP500Adj_Close where IBD50_YY_Master.date >= (
select min(date) from IBD50_YY_Master where rank > 0 and date >='2013-01-01' and date < '2013-12-31' )  from IBD50_YY_Master inner join IBD50_WWWW
_Master on IBD50_YY_Master.Date =  IBD50_WWWW_Master.Date order by IBD50_YY_Master.Date asc;  # this didn't work

select IBD50_YY_Master.Date, IBD50_YY_Master.Open, IBD50_YY_Master.High, IBD50_YY_Master.Low, IBD50_YY_Master.Close, IBD50_YY_Master.Volume, IBD50
_YY_Master.Adj_Close, IBD50_WWWW_Master.Open as SP500Open, IBD50_WWWW_Master.High as SP500High , IBD50_WWWW_Master.Low as SP500Low , IBD50_WWWW_Ma
ster.Close as SP500Close , IBD50_WWWW_Master.Volume as SP500Volume , IBD50_WWWW_Master.Adj_Close as SP500Adj_Close where IBD50_YY_Master.date >= (
select min(IBD50_YY_Master.date) from IBD50_YY_Master where IBD50_YY_Master.rank > 0 and IBD50_YY_Master.date >='2013-01-01' and IBD50_YY_Master.d
ate < '2013-12-31' )  from IBD50_YY_Master inner join IBD50_WWWW_Master on IBD50_YY_Master.Date =  IBD50_WWWW_Master.Date order by IBD50_YY_Master
.Date asc;  # this didn't work

select IBD50_YY_Master.Date, IBD50_YY_Master.Open, IBD50_YY_Master.High, IBD50_YY_Master.Low, IBD50_YY_Master.Close, IBD50_YY_Master.Volume, IBD50
_YY_Master.Adj_Close, IBD50_WWWW_Master.Open as SP500Open, IBD50_WWWW_Master.High as SP500High , IBD50_WWWW_Master.Low as SP500Low , IBD50_WWWW_Ma
ster.Close as SP500Close , IBD50_WWWW_Master.Volume as SP500Volume , IBD50_WWWW_Master.Adj_Close as SP500Adj_Close from IBD50_YY_Master inner join
 IBD50_WWWW_Master on IBD50_YY_Master.Date =  IBD50_WWWW_Master.Date order by IBD50_YY_Master.date asc;


select * from Disca inner join disck on disca.date = disck.date

'SELECT BC20_PCLN_Master.Date, BC20_PCLN_Master.Open, BC20_PCLN_Master.High, BC20_PCLN_Master.Low, BC20_PCLN_Master.Close, BC20_PCLN_Master.Volume, BC20_PCLN_Master.Adj_Close, _GSPC.Open as SP500Open, _GSPC.High as SP500High , _GSPC.Low as SP500Low , _GSPC.Close as SP500Close , _GSPC.Volume as SP500Volume , _GSPC.Adj_Close as SP500Adj_Close  FROM BC20_PCLN_Master INNER JOIN _GSPC ON BC20_PCLN_Master.Date =  _GSPC.Date WHERE BC20_PCLN_Master.date >= (select min(BC20_PCLN_Master.date) from BC20_PCLN_Master where BC20_PCLN_Master.rank > 0 and BC20_PCLN_Master.date >="2013-01-01" and BC20_PCLN_Master.date < "2013-12-31" ) ORDER BY BC20_PCLN_Master.Date ASC'),

*/
