var express = require('express')
  , routes  = require('./server/routes')
  , path    = require('path')
  , app     = express();

app.set('port', process.env.PORT || 3000);
app.set('isprod', process.env.NODE_ENV === 'production');
app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.disable('x-powered-by');

app.use(express.compress());
app.use(express.json());
app.use(express.favicon());
app.use(express.static(path.resolve(__dirname, 'public')));

//
// Routes
// ======
//

app.get('/', routes.index);
app.get('/api/stocks/:id?', routes.stocks);

//  app.get('/dates/:date?', routes.dates); //the route for the actual date detail is broken

app.listen(app.get('port'));
