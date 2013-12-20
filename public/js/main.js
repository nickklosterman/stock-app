/* jshint undef: false, unused: false */

var StockApp = StockApp || {};

!function(window, StockApp, $) {
  'use strict';

  var chart = $('.linechart');
  if (chart) chart.sparkline('html', { chartRangeMin: 1, chartRangeMax: 20 });
}(window, StockApp, jQuery);
