var express = require('express')
  , path    = require('path')
  , app     = express();

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.disable('x-powered-by');

app.use(express.compress());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

//
// Bootstrap routes.
//
require('./server/routes')(app);

app.listen(process.env.PORT || 3000);
