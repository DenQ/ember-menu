/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-menu',
  included: function(app) {
    this._super.included(app);

    app.import('bower_components/bootstrap/dist/js/bootstrap.min.js');
    app.import('bower_components/bootstrap/dist/css/bootstrap.min.css');
  }
};
