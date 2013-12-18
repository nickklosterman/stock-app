
var sqlite3 = require('sqlite3');
var db;

function createDb() {
console.log("createDb chain");
db = new sqlite3.Database('IBDTestDatabaseBC20.sqlite');
};

function getDistinctTickers(callback) {
    console.log('get distinct tickers');
    //var queryResult=[];
    var queryResult={};
    queryResult.data=[]; //for handlebars, to use #each, I need to package into a named array.
    var sql = "SELECT distinct(stockticker) from BC20 order by stockticker Asc";
    db.all(sql,function(err,rows){
	//	queryResult.data = rows;
	rows.forEach(function (row) {
	    console.log(row);
	    queryResult.data.push(row);
	});
	closeDb();
	callback( queryResult);
    });
    

    //it's async so we return inside the callback.
};

function closeDb() {
    console.log("closeDb");
    db.close();
}

exports.index = function index(req, res) {
    createDb();
    // var queryResult = getDistinctTickers();
    // if (queryResult && queryResult.length > 0 ) {
    // 	console.log(queryResult.length);
    // 	return res.render('index', queryResult);
    // 	}

//need to use a callback since this shit be all async yo
    getDistinctTickers(function(data) {
	console.log("now go render");
	console.log(data)
//	data = { name:"bob", age:32};
	return	res.render('index',data);

    });    
    //  console.log(queryResult);
    //    return res.render('index');
};

exports.detail = function detail(req, res) {
  // TODO: get stock data for symbol.
  var data = {
    symbol: 'aapl'
  , rank: '2'
  };
  
  return res.render('detail', { stock: data });
};
