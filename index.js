var express = require('express')
  //, routes  = require('./server/routes')(app,process.argv[2] || 'IBDTestDatabaseBC20.sqlite')
  , path    = require('path')
  , app     = express();
var routes  = require('./server/routes')(app,process.argv[2] || 'IBDTestDatabaseBC20.sqlite');

//http://stackoverflow.com/questions/4351521/how-to-pass-command-line-arguments-to-node-js http://nodejs.org/docs/latest/api/process.html#process_process_argv
if ( false ) {
process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});
}

app.set('port', process.env.PORT || 3000);
app.set('isprod', process.env.NODE_ENV === 'production');
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.disable('x-powered-by');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.compress());
app.use(express.json());
app.use(app.router);
app.use(express.static(path.resolve(__dirname, 'public')));

if ('development' === app.get('env')) {
  app.use(express.errorHandler());
}

//
// Routes
// ======
//
//app.get('/', routes.index);
//app.get('/api/stocks/:id?', routes.stocks);

// app.get('/dates/:date?', routes.dates);

app.listen(app.get('port'));
