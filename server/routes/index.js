function index(req, res) {
  res.render('index');
}

module.exports = function(app) {

  //
  // GET index.
  //
  app.get('/', index);
};
