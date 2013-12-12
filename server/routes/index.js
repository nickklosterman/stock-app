exports.index = function(req, res) {
  return res.render('index');
};

exports.detail = function(req, res) {
  // TODO: get stock data for symbol.
  var data = {
    symbol: 'aapl'
  , rank: '2'
  };
  
  return res.render('detail', { stock: data });
};
