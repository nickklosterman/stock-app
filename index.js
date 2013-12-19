var express = require('express')
  , routes  = require('./server/routes')
  , path    = require('path')
  , app     = express();

app.set('port', process.env.PORT || 3000);
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

//routes are order specific. it will execute teh firs route matched. 
//why don't we use the express router?
app.get('/', routes.index);
app.get('/dates/', routes.datesindex);
app.get('/dates/:date', routes.date_rank_list );
app.get('/:id', routes.detail);


app.listen(app.get('port'), function() {
  console.log('Server listening on port', app.get('port'));
});
