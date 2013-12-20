/* jshint undef: false */

var StockApp = StockApp || {};

!function(window, StockApp, $) {
  'use strict';

  StockApp.chart = $('.linechart');
  if (StockApp.chart) StockApp.chart.sparkline('html', { chartRangeMin: 1, chartRangeMax: 20 });

}(window, StockApp, jQuery);
