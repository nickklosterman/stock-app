var express = require('express')
  , routes  = require('./server/routes')
  , path    = require('path')
  , app     = express();

app.set('view engine', 'hbs');
app.set('views', path.resolve(__dirname, 'views'));

app.disable('x-powered-by');

app.use(express.compress());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));

//
// Routes
// ======
//

app.get('/', routes.index);
app.get('/:id', routes.detail);

app.listen(process.env.PORT || 3000);
