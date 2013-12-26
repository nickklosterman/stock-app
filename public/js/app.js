window.StockApp = {};
window.StockApp.Views = {};
window.StockApp.Models = {};
window.StockApp.Collections = {};

(function(StockApp, $, Backbone, _) {
  'use strict';

  StockApp.Models.Stock = Backbone.Model.extend({
    rootUrl: '/api/stocks/'
  });

  StockApp.Collections.Stocks = Backbone.Collection.extend({
    url: '/api/stocks'
  });

  StockApp.Views.Detail = Backbone.View.extend({
    el: '.detail',
    template: _.template($('#detail').html()),
    initialize: function(options) {
      this.ticker = options.ticker;
      this.model = new StockApp.Models.Stock();
      this.model.url = function() {
        return this.rootUrl + options.ticker;
      };

      this.model.fetch({ success: _.bind(this.render, this) });
    },
    render: function() {
      this.$el.html(this.template({
        ticker: this.ticker,
        data: this.model.toJSON()
      }));

      //
      // Add the `selected` class to the button for the current ticker, slide
      //    the view into view, then initialize the line chart.
      //
      $('a.btn[data-ticker="'+ this.ticker +'"]').addClass('selected');
      this.$el.slideDown();
      this.$el.find('.linechart').sparkline('html', {
        chartRangeMin: 1,
        chartRangeMax: 20
      });
    },
    hide: function() {
      this.$el.hide();
    }
  });

  StockApp.Views.Index = Backbone.View.extend({
    el: '.list',
    events: {
      'click a.btn': 'clearSelection'
    },
    template: _.template($('#index').html()),
    initialize: function() {
      this.collection.fetch({ success: _.bind(this.render, this) });
    },
    render: function() {
      this.$el.html(this.template({ stocks: this.collection.toJSON() }));
    },
    clearSelection: function(e) {
      $('.selected').removeClass('selected');
      if (this.detail) this.detail.hide();
    },
    showDetail: function(options) {
      this.detail = new StockApp.Views.Detail(options);
    },
  });

  StockApp.Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':ticker': 'detail'
    },
    index: function() {
      console.log('router::view::index');
      this.indexView = new StockApp.Views.Index({
        collection: new StockApp.Collections.Stocks()
      });
    },
    detail: function(ticker) {
      console.log('router::view::detail');

      //
      // Ensure that links directly to the detail for a ticker correctly
      //    instantiate the index view. This will correctly save the state
      //    of the application in the URL of the ticker.
      //
      if (!this.indexView) this.index();
      this.indexView.showDetail({ ticker: ticker });
    }
  });

  // Fire it up.
  new StockApp.Router();
  Backbone.history.start();

})(window.StockApp, window.jQuery, window.Backbone, window._);
