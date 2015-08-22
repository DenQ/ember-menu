"use strict";
/* jshint ignore:start */

/* jshint ignore:end */

define('ember-menu/acceptance-tests/main', ['exports', 'ember-cli-sri/acceptance-tests/main'], function (exports, main) {

	'use strict';



	exports['default'] = main['default'];

});
define('ember-menu/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	var AppAdapter;

	AppAdapter = DS['default'].LSAdapter.extend();

	exports['default'] = AppAdapter;

});
define('ember-menu/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', 'ember-menu/config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  var App;

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('ember-menu/components/q-menu', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var QMenuComponent,
      slice = [].slice;

  QMenuComponent = Ember['default'].Component.extend({
    storage: Ember['default'].inject.service('store'),
    'model-name': '',
    data: [],
    'brand-name': null,
    'brand-route': null,
    didInsertElement: function didInsertElement() {
      var etc, that;
      etc = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this._super(etc);
      that = this;
      Ember['default'].run.schedule('afterRender', function () {
        return that.InitData();
      });
    },
    InitData: function InitData() {
      var loading, that;
      that = this;
      loading = this.LoadModel();
      loading.then(function (model) {
        return that.WalkModel(model);
      });
    },
    LoadModel: function LoadModel() {
      var loading, modelName, storage;
      storage = this.get('storage');
      modelName = this.get('model-name');
      loading = storage.findAll(modelName);
      return loading;
    },
    WalkModel: function WalkModel(model) {
      var activeClass, i, item, items, len, mas;
      items = model.toArray();
      mas = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        activeClass = '';
        if (item.get('route') === this.GetCurrentPath()) {
          activeClass = 'active';
        }
        Ember['default'].set(item, 'activeClass', activeClass);
        mas.push(item);
      }
      this.set('data', mas);
    },
    GetCurrentPath: function GetCurrentPath() {
      var app;
      app = this.container.lookup('controller:application');
      return app.get('currentPath');
    },
    actions: {
      selectItem: function selectItem(item) {
        this.InitData();
      },
      selectBrand: function selectBrand() {
        this.InitData();
      }
    }
  });

  exports['default'] = QMenuComponent;

});
define('ember-menu/controllers/array', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('ember-menu/controllers/object', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller;

});
define('ember-menu/initializers/export-application-global', ['exports', 'ember', 'ember-menu/config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    if (config['default'].exportApplicationGlobal !== false) {
      var value = config['default'].exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = Ember['default'].String.classify(config['default'].modulePrefix);
      }

      if (!window[globalName]) {
        window[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete window[globalName];
          }
        });
      }
    }
  }

  ;

  exports['default'] = {
    name: 'export-application-global',

    initialize: initialize
  };

});
define('ember-menu/initializers/q-menu', ['exports'], function (exports) {

  'use strict';

  var Init, JSON_DATA, QMenuInitializer, TruncateModel;

  JSON_DATA = {
    items: [{
      'name': 'index',
      'route': 'index'
    }, {
      'name': 'products',
      'route': 'products'
    }, {
      'name': 'info',
      'route': 'info'
    }, {
      'name': 'about',
      'route': 'about'
    }]
  };

  Init = function (container, application) {
    return new Promise(function (resolve, reject) {
      var menu, store;
      store = container.lookup('service:store');
      menu = store.findAll('q-menu');
      return menu.then(function (model) {
        var __items, i, item, items, len, promises, row;
        items = model.toArray();
        if (items.length === 0) {
          __items = Ember.get(JSON_DATA, 'items');
          promises = [];
          for (i = 0, len = __items.length; i < len; i++) {
            item = __items[i];
            row = store.createRecord('q-menu', {
              'name': Ember.get(item, 'name'),
              'route': Ember.get(item, 'route')
            });
            promises.push(row.save());
          }
          return Promise.all(promises).then(function (t) {
            resolve(true);
            return Ember.debug('Save menu');
          });
        } else {
          return resolve(true);
        }
      });
    });
  };

  TruncateModel = function (modelName, container) {
    var store;
    store = container.lookup('service:store');
    return new Promise(function (resolve, reject) {
      var modelLoading;
      modelLoading = store.findAll(modelName);
      return modelLoading.then(function (model) {
        var i, item, items, len, promises;
        items = model.toArray();
        promises = [];
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          item.deleteRecord();
          promises.push(item.save());
        }
        return Promise.all(promises).then(function (t) {
          resolve(model);
          return Ember.debug('Truncate menu');
        });
      });
    });
  };

  QMenuInitializer = {
    name: 'q-menu',
    after: 'store',
    initialize: function initialize(container, application) {
      var load;
      application.deferReadiness();
      load = Init(container, application);
      load.then(function (m) {
        return application.advanceReadiness();
      });
    }
  };

  exports['default'] = QMenuInitializer;

});
define('ember-menu/instance-initializers/app-version', ['exports', 'ember-menu/config/environment', 'ember'], function (exports, config, Ember) {

  'use strict';

  var classify = Ember['default'].String.classify;
  var registered = false;

  exports['default'] = {
    name: 'App Version',
    initialize: function initialize(application) {
      if (!registered) {
        var appName = classify(application.toString());
        Ember['default'].libraries.register(appName, config['default'].APP.version);
        registered = true;
      }
    }
  };

});
define('ember-menu/models/q-menu', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  var QMenuModel;

  QMenuModel = DS['default'].Model.extend({
    name: DS['default'].attr('string'),
    route: DS['default'].attr('string')
  });

  exports['default'] = QMenuModel;

});
define('ember-menu/router', ['exports', 'ember', 'ember-menu/config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router;

  Router = Ember['default'].Router.extend({
    location: config['default'].locationType
  });

  Router.map(function () {
    this.route('index', {
      path: '/'
    });
    this.route('products', {
      path: '/products'
    });
    this.route('info', {
      path: '/info'
    });
    return this.route('about', {
      path: '/about'
    });
  });

  exports['default'] = Router;

});
define('ember-menu/serializers/application', ['exports', 'ember-data'], function (exports, DS) {

	'use strict';

	var AppSerializer;

	AppSerializer = DS['default'].LSSerializer.extend();

	exports['default'] = AppSerializer;

});
define('ember-menu/templates/application', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    return {
      meta: {
        "revision": "Ember@1.13.5",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 1,
            "column": 69
          }
        },
        "moduleName": "ember-menu/templates/application.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createComment("");
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var morphs = new Array(1);
        morphs[0] = dom.createMorphAt(fragment,0,0,contextualElement);
        dom.insertBoundary(fragment, 0);
        dom.insertBoundary(fragment, null);
        return morphs;
      },
      statements: [
        ["inline","q-menu",[],["model-name","q-menu","brand-name","QMenu","brand-route","index"],["loc",[null,[1,0],[1,69]]]]
      ],
      locals: [],
      templates: []
    };
  }()));

});
define('ember-menu/templates/components/q-menu', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.HTMLBars.template((function() {
    var child0 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.5",
            "loc": {
              "source": null,
              "start": {
                "line": 12,
                "column": 16
              },
              "end": {
                "line": 14,
                "column": 16
              }
            },
            "moduleName": "ember-menu/templates/components/q-menu.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                    ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","brand-name",["loc",[null,[13,20],[13,34]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.5",
          "loc": {
            "source": null,
            "start": {
              "line": 4,
              "column": 8
            },
            "end": {
              "line": 16,
              "column": 8
            }
          },
          "moduleName": "ember-menu/templates/components/q-menu.hbs"
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("            ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("div");
          dom.setAttribute(el1,"class","navbar-header");
          var el2 = dom.createTextNode("\n                ");
          dom.appendChild(el1, el2);
          var el2 = dom.createElement("button");
          dom.setAttribute(el2,"type","button");
          dom.setAttribute(el2,"class","navbar-toggle collapsed");
          dom.setAttribute(el2,"data-toggle","collapse");
          dom.setAttribute(el2,"data-target","#bs-example-navbar-collapse-1");
          dom.setAttribute(el2,"aria-expanded","false");
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","sr-only");
          var el4 = dom.createTextNode("Toggle navigation");
          dom.appendChild(el3, el4);
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","icon-bar");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","icon-bar");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                    ");
          dom.appendChild(el2, el3);
          var el3 = dom.createElement("span");
          dom.setAttribute(el3,"class","icon-bar");
          dom.appendChild(el2, el3);
          var el3 = dom.createTextNode("\n                ");
          dom.appendChild(el2, el3);
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("            ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element1 = dom.childAt(fragment, [1]);
          var morphs = new Array(2);
          morphs[0] = dom.createElementMorph(element1);
          morphs[1] = dom.createMorphAt(element1,3,3);
          return morphs;
        },
        statements: [
          ["element","action",["selectBrand"],[],["loc",[null,[5,39],[5,63]]]],
          ["block","link-to",[["get","brand-route",["loc",[null,[12,27],[12,38]]]]],["class","navbar-brand"],0,null,["loc",[null,[12,16],[14,28]]]]
        ],
        locals: [],
        templates: [child0]
      };
    }());
    var child1 = (function() {
      var child0 = (function() {
        return {
          meta: {
            "revision": "Ember@1.13.5",
            "loc": {
              "source": null,
              "start": {
                "line": 22,
                "column": 24
              },
              "end": {
                "line": 24,
                "column": 24
              }
            },
            "moduleName": "ember-menu/templates/components/q-menu.hbs"
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode("                            ");
            dom.appendChild(el0, el1);
            var el1 = dom.createComment("");
            dom.appendChild(el0, el1);
            var el1 = dom.createTextNode("\n");
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
            var morphs = new Array(1);
            morphs[0] = dom.createMorphAt(fragment,1,1,contextualElement);
            return morphs;
          },
          statements: [
            ["content","item.name",["loc",[null,[23,28],[23,41]]]]
          ],
          locals: [],
          templates: []
        };
      }());
      return {
        meta: {
          "revision": "Ember@1.13.5",
          "loc": {
            "source": null,
            "start": {
              "line": 20,
              "column": 16
            },
            "end": {
              "line": 26,
              "column": 16
            }
          },
          "moduleName": "ember-menu/templates/components/q-menu.hbs"
        },
        arity: 1,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode("                    ");
          dom.appendChild(el0, el1);
          var el1 = dom.createElement("li");
          var el2 = dom.createTextNode("\n");
          dom.appendChild(el1, el2);
          var el2 = dom.createComment("");
          dom.appendChild(el1, el2);
          var el2 = dom.createTextNode("                    ");
          dom.appendChild(el1, el2);
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode("\n");
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var element0 = dom.childAt(fragment, [1]);
          var morphs = new Array(3);
          morphs[0] = dom.createAttrMorph(element0, 'class');
          morphs[1] = dom.createElementMorph(element0);
          morphs[2] = dom.createMorphAt(element0,1,1);
          return morphs;
        },
        statements: [
          ["attribute","class",["concat",[["get","item.activeClass",["loc",[null,[21,62],[21,78]]]]]]],
          ["element","action",["selectItem",["get","item",["loc",[null,[21,46],[21,50]]]]],[],["loc",[null,[21,24],[21,52]]]],
          ["block","link-to",[["get","item.route",["loc",[null,[22,35],[22,45]]]]],[],0,null,["loc",[null,[22,24],[24,36]]]]
        ],
        locals: ["item"],
        templates: [child0]
      };
    }());
    return {
      meta: {
        "revision": "Ember@1.13.5",
        "loc": {
          "source": null,
          "start": {
            "line": 1,
            "column": 0
          },
          "end": {
            "line": 31,
            "column": 6
          }
        },
        "moduleName": "ember-menu/templates/components/q-menu.hbs"
      },
      arity: 0,
      cachedFragment: null,
      hasRendered: false,
      buildFragment: function buildFragment(dom) {
        var el0 = dom.createDocumentFragment();
        var el1 = dom.createElement("nav");
        dom.setAttribute(el1,"class","navbar navbar-default");
        var el2 = dom.createTextNode("\n    ");
        dom.appendChild(el1, el2);
        var el2 = dom.createElement("div");
        dom.setAttribute(el2,"class","container-fluid");
        var el3 = dom.createTextNode("\n\n");
        dom.appendChild(el2, el3);
        var el3 = dom.createComment("");
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n        ");
        dom.appendChild(el2, el3);
        var el3 = dom.createElement("div");
        dom.setAttribute(el3,"class","collapse navbar-collapse");
        dom.setAttribute(el3,"id","bs-example-navbar-collapse-1");
        var el4 = dom.createTextNode("\n            ");
        dom.appendChild(el3, el4);
        var el4 = dom.createElement("ul");
        dom.setAttribute(el4,"class","nav navbar-nav");
        var el5 = dom.createTextNode("\n");
        dom.appendChild(el4, el5);
        var el5 = dom.createComment("");
        dom.appendChild(el4, el5);
        var el5 = dom.createTextNode("            ");
        dom.appendChild(el4, el5);
        dom.appendChild(el3, el4);
        var el4 = dom.createTextNode("\n        ");
        dom.appendChild(el3, el4);
        dom.appendChild(el2, el3);
        var el3 = dom.createTextNode("\n\n    ");
        dom.appendChild(el2, el3);
        dom.appendChild(el1, el2);
        var el2 = dom.createTextNode("\n");
        dom.appendChild(el1, el2);
        dom.appendChild(el0, el1);
        return el0;
      },
      buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
        var element2 = dom.childAt(fragment, [0, 1]);
        var morphs = new Array(2);
        morphs[0] = dom.createMorphAt(element2,1,1);
        morphs[1] = dom.createMorphAt(dom.childAt(element2, [3, 1]),1,1);
        return morphs;
      },
      statements: [
        ["block","if",[["get","brand-name",["loc",[null,[4,14],[4,24]]]]],[],0,null,["loc",[null,[4,8],[16,15]]]],
        ["block","each",[["get","data",["loc",[null,[20,24],[20,28]]]]],[],1,null,["loc",[null,[20,16],[26,25]]]]
      ],
      locals: [],
      templates: [child0, child1]
    };
  }()));

});
define('ember-menu/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('ember-menu/tests/helpers/resolver', ['exports', 'ember/resolver', 'ember-menu/config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('ember-menu/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/resolver.js should pass jshint', function() { 
    ok(true, 'helpers/resolver.js should pass jshint.'); 
  });

});
define('ember-menu/tests/helpers/start-app', ['exports', 'ember', 'ember-menu/app', 'ember-menu/config/environment'], function (exports, Ember, Application, config) {

  'use strict';



  exports['default'] = startApp;
  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }

});
define('ember-menu/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/start-app.js should pass jshint', function() { 
    ok(true, 'helpers/start-app.js should pass jshint.'); 
  });

});
define('ember-menu/tests/integration/components/q-menu-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('q-menu', 'Integration | Component | q menu', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template((function () {
      return {
        meta: {
          'revision': 'Ember@1.13.5',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 1,
              'column': 10
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 0, 0, contextualElement);
          dom.insertBoundary(fragment, 0);
          dom.insertBoundary(fragment, null);
          return morphs;
        },
        statements: [['content', 'q-menu', ['loc', [null, [1, 0], [1, 10]]]]],
        locals: [],
        templates: []
      };
    })()));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template((function () {
      var child0 = (function () {
        return {
          meta: {
            'revision': 'Ember@1.13.5',
            'loc': {
              'source': null,
              'start': {
                'line': 2,
                'column': 4
              },
              'end': {
                'line': 4,
                'column': 4
              }
            }
          },
          arity: 0,
          cachedFragment: null,
          hasRendered: false,
          buildFragment: function buildFragment(dom) {
            var el0 = dom.createDocumentFragment();
            var el1 = dom.createTextNode('      template block text\n');
            dom.appendChild(el0, el1);
            return el0;
          },
          buildRenderNodes: function buildRenderNodes() {
            return [];
          },
          statements: [],
          locals: [],
          templates: []
        };
      })();

      return {
        meta: {
          'revision': 'Ember@1.13.5',
          'loc': {
            'source': null,
            'start': {
              'line': 1,
              'column': 0
            },
            'end': {
              'line': 5,
              'column': 2
            }
          }
        },
        arity: 0,
        cachedFragment: null,
        hasRendered: false,
        buildFragment: function buildFragment(dom) {
          var el0 = dom.createDocumentFragment();
          var el1 = dom.createTextNode('\n');
          dom.appendChild(el0, el1);
          var el1 = dom.createComment('');
          dom.appendChild(el0, el1);
          var el1 = dom.createTextNode('  ');
          dom.appendChild(el0, el1);
          return el0;
        },
        buildRenderNodes: function buildRenderNodes(dom, fragment, contextualElement) {
          var morphs = new Array(1);
          morphs[0] = dom.createMorphAt(fragment, 1, 1, contextualElement);
          return morphs;
        },
        statements: [['block', 'q-menu', [], [], 0, null, ['loc', [null, [2, 4], [4, 15]]]]],
        locals: [],
        templates: [child0]
      };
    })()));

    assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('ember-menu/tests/integration/components/q-menu-test.jshint', function () {

  'use strict';

  module('JSHint - integration/components');
  test('integration/components/q-menu-test.js should pass jshint', function() { 
    ok(true, 'integration/components/q-menu-test.js should pass jshint.'); 
  });

});
define('ember-menu/tests/integration/components/q-tmp-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent('q-tmp', 'Integration | Component | q tmp', {
    integration: true
  });

  ember_qunit.test('it renders', function (assert) {
    assert.expect(2);
    this.render(hbs("{{q-tmp}}"));
    assert.equal(this.$().text().trim(), '');
    this.render(hbs("{{#q-tmp}}\n  template block text\n{{/q-tmp}}"));
    return assert.equal(this.$().text().trim(), 'template block text');
  });

});
define('ember-menu/tests/test-helper', ['ember-menu/tests/helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

});
define('ember-menu/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('test-helper.js should pass jshint', function() { 
    ok(true, 'test-helper.js should pass jshint.'); 
  });

});
define('ember-menu/tests/unit/initializers/q-menu-test', ['ember', 'ember-menu/initializers/q-menu', 'qunit'], function (Ember, q_menu, qunit) {

  'use strict';

  var application, registry;

  application = null;

  registry = null;

  qunit.module('Unit | Initializer | q menu', {
    beforeEach: function beforeEach() {
      return Ember['default'].run(function () {
        application = Ember['default'].Application.create();
        registry = application.registry;
        return application.deferReadiness();
      });
    }
  });

  qunit.test('it works', function (assert) {
    q_menu.initialize(registry, application);
    return assert.ok(true);
  });

});
/* jshint ignore:start */

/* jshint ignore:end */

/* jshint ignore:start */

define('ember-menu/config/environment', ['ember'], function(Ember) {
  var prefix = 'ember-menu';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("ember-menu/tests/test-helper");
} else {
  require("ember-menu/app")["default"].create({"name":"ember-menu","version":"0.0.8+b6630b55"});
}

/* jshint ignore:end */
//# sourceMappingURL=ember-menu.map