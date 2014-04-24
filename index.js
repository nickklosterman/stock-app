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


/*
(09:37:09 AM) nicky_k: fiveisprime, i have a newbz node question. if I have command line argument that I grab how would I pass that to my route? I want to be able to specify a local db file and have the routes pull from the specified db.
(09:37:13 AM) nicky_k: can I do : app.get('/api/stocks/:id?', routes.stocks("foo"));
(09:37:33 AM) nicky_k: but then what do I do to : exports.stocks = function(req, res) { ...?
(09:38:03 AM) nicky_k: it gets the req/res from the callback but I want to pass in an arg.
(09:39:03 AM) nicky_k: which leads me to wonder how the req/res gets passed in in the first place.
(09:42:52 AM) fiveisprime: I don't know what you mean
(09:43:00 AM) fiveisprime: command line argument passed to an http route?
(09:43:35 AM) fiveisprime: the function you pass to get is the callback called when a request is made to that route
(09:44:00 AM) fiveisprime: maybe if I understood what you are trying to do, I could help
(09:44:33 AM) fiveisprime: Linked tells me that today is Josh's birthday
(09:44:41 AM) fiveisprime: lol is that something that Linkedin does?
(09:47:48 AM) nicky_k: for stock-app I want to be able to specify the sqlite db to use on the command line.
(09:48:01 AM) nicky_k: the routes use the db to pull the data to display
(09:48:27 AM) fiveisprime: so you want to start the app as $ node . test.db
(09:48:34 AM) fiveisprime: and have test.db be used
(09:48:42 AM) nicky_k: so I want to set something like db_to_use=process.argv[2]; and have that always be used
(09:48:43 AM) fiveisprime: you are complicating that a little bit
(09:48:58 AM) nicky_k: fair enough.
(09:49:56 AM) fiveisprime: I would suggest changing routes/index.js to export a function that accepts the express app and the database specifier
(09:50:17 AM) fiveisprime: module.exports = function (app, db) { };
(09:50:32 AM) fiveisprime: in there, attach the route handlers
(09:50:41 AM) nicky_k: so that is how you would pass in the variable? hmm ok.
(09:51:05 AM) fiveisprime: in the main index.js, bootstrap the routes like this: require('./routes')(app, process.argv[2] || 'default');
(09:51:18 AM) fiveisprime: there are a bunch of ways to do it
(09:51:24 AM) fiveisprime: that's just my suggestion
(09:52:21 AM) nicky_k: ok. fair enough thanks!  I suppose I'm taking a lesson from you that 'it doesn't matter' about working on JIRA tickets lol...
(09:52:33 AM) fiveisprime: haha good
(09:53:16 AM) fiveisprime: The reason I prefer the dependency injection method is because it keeps the modules (the route module in this case) decoupled from the express app
(09:53:33 AM) fiveisprime: You could take it a step further and abstract the database
(09:53:55 AM) fiveisprime: make a model module that wraps up the database and exposes a consistent API for handling data
(09:54:28 AM) fiveisprime: in the future, you could pass in a connection string rather than the database filename
(09:54:48 AM) fiveisprime: your model module would know how to handle different connections and keep the route code consistent
(09:55:13 AM) fiveisprime: Even easier, you could use and environment variable for the database name
(09:55:28 AM) fiveisprime: DB_NAME="test.db" node .
(09:55:37 AM) fiveisprime: then just use process.env.DB_NAME
(09:55:45 AM) fiveisprime: you wouldn't have to change anything then
(09:55:47 AM) fiveisprime: lol
(09:57:20 AM) nicky_k: wow. thanks for spelling all those diff methods out. I'll have to research the 'abstract the db' one. that was a bit over my head.

*/
