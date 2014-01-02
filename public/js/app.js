window.StockApp = {};
window.StockApp.Views = {};
window.StockApp.Models = {};
window.StockApp.Collections = {};

(function(StockApp, $, Backbone, _) {
  'use strict';

  //
  // Models & Collections
  // ====================
  //

  StockApp.Models.Stock = Backbone.Model.extend({
    rootUrl: '/api/stocks/'
  });

  StockApp.Collections.Stocks = Backbone.Collection.extend({
    url: '/api/stocks'
  });

  //
  // Views
  // =====
  //

  //
  // Includes the details for a specific stock. Renders the details in a list
  //    and shows a line charts for specific fields.
  //
  StockApp.Views.Detail = Backbone.View.extend({
    el: '.detail',
    template: _.template($('#detail').html()),
    initialize: function(options) {
      this.ticker = options.ticker;
      this.model = new StockApp.Models.Stock();
      // Set the model's url to get the data for the correct ticker.
      this.model.url = function() {
        return this.rootUrl + options.ticker;
      };

      this.model.fetch({ success: _.bind(this.render, this) });
    },
    render: function() {
      // Render the view with both the model data and the ticker name.
      this.$el.html(this.template({
        ticker: this.ticker,
        data: this.model.toJSON()
      }));

      // Configure each of the line charts.
      this.$el.find('.linechart').sparkline('html', {
        chartRangeMin: 1,
        chartRangeMax: 20
      });
    },
    show: function() {
      document.title = 'Stock App | ' + this.ticker;
      this.$el.fadeIn(100);
    },
    hide: function() {
      document.title = 'Stock App';
      this.$el.fadeOut(100);
    }
  });

  //
  // Shows every available stock. Includes a child detail view to show details
  //    for a stock when clicked.
  //
  StockApp.Views.Index = Backbone.View.extend({
    el: '.list',
    template: _.template($('#index').html()),
    initialize: function() {
      this.collection.fetch({ success: _.bind(this.render, this) });
    },
    render: function() {
      this.$el.html(this.template({ stocks: this.collection.toJSON() }));
    },
    showDetail: function(options) {
      this.detail = new StockApp.Views.Detail(options);
      this.detail.show();
    },
    hideDetail: function() {
      this.detail.hide();
    }
  });

  //
  // Router
  // ======
  //

  StockApp.Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':ticker': 'detail'
    },
    index: function() {
      //
      // Only instantiate the index view if it needs to it.
      //
      if (this.indexView) {
        this.indexView.hideDetail();
      } else {
        this.indexView = new StockApp.Views.Index({
          collection: new StockApp.Collections.Stocks()
        });
      }
    },
    detail: function(ticker) {
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

}(window.StockApp, window.jQuery, window.Backbone, window._));
