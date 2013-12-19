
var sqlite3 = require('sqlite3');
var db;

function createDb() {
    console.log("createDb chain");
    db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');
};

function getDistinctTickers(callback) {
    console.log('get distinct tickers');
    var queryResult={};
    queryResult.data=[]; //for handlebars, to use #each, I need to package into a named array.
    var sql = "SELECT DISTINCT(stockticker) FROM BC20 ORDER BY stockticker ASC";
    db.all(sql,function(err,rows){
	rows.forEach(function (row) {
	    console.log(row);
	    queryResult.data.push(row);
	});
	closeDb();
	callback( queryResult);
    });
    //it's async so we return inside the callback.
};

function getDistinctDates(callback) {
    console.log('get distinct tickers');
    var queryResult={};
    queryResult.data=[]; //for handlebars, to use #each, I need to package into a named array.
    var sql = "SELECT distinct(date) from BC20";// order by date Asc";
    db.all(sql,function(err,rows){
	if (err){ console.log(err) }
	else {
	    rows.forEach(function (row) {
		console.log(row);
		queryResult.data.push(row);
	    });
	}

	closeDb();
	callback( queryResult);
    });

};

function closeDb() {
    console.log("closeDb");
    db.close();
}
function getDateList(date,callback) {
console.log('get rank list for a particular date');
console.log(date);
var queryResult={};
    queryResult.data=[]; //for handlebars, to use #each, I need to package into a named array.
    var sql = "SELECT rank,stockticker from BC20 where Date=\""+date+"\" order by Rank Asc";
    db.all(sql,function(err,rows){
	rows.forEach(function (row) {
	    console.log(row);
	    queryResult.data.push(row);
	});
	closeDb();
	callback( queryResult);
    });
};


function getTickersRanking(ticker,callback) {
console.log('get date and ranking info from db');
    var queryResult={};
    queryResult.data=[]; //for handlebars, to use #each, I need to package into a named array.
    var sql = "SELECT id,date,rank FROM BC20 WHERE StockTicker LIKE \""+ticker+"\" ORDER BY rank ASC";
    db.all(sql,function(err,rows){
	if (typeof rows !== undefined){  ///needs some type of error handling here.
	    rows.forEach(function (row) {
		console.log(row);
		queryResult.data.push(row);
	    });
	}
	closeDb();
	callback( queryResult);
    });

};


exports.index = function index(req, res) {
    createDb();

//need to use a callback since this shit be all async yo
    getDistinctTickers(function(data) {
	console.log('now go render index');
	console.log(data)
	return	res.render('index',data);

    });

};

//
// Get data for all dates or specific date data if specified.
//
exports.dates = function dates(req, res) {
  createDb();

  if (req.params.date) {
    console.log(req.params.date);
    getDateList(req.params.date, function(data) {
      data.date = req.params.date;
      res.render('date-rank-list', data);
    });
  } else {
    getDistinctDates(function(data) {
      console.log('now go render datesindex');
      console.log(data)
      res.render('datesindex', data);
    });
  }
};

exports.detail = function detail(req, res) {
  createDb();
  console.log(req.params.id)
  getTickersRanking(req.params.id, function(data) {
    data.ticker = req.params.id;
    return res.render('detail', data);
  });
};
