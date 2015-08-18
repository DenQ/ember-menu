`import Ember from 'ember'`

QMenuComponent = Ember.Component.extend
  storage: Ember.inject.service('store')
  'model-name': ''
  data: []
  'brand-name': null
  'brand-route': null

  didInsertElement:(etc...)->
    @_super etc
    that = @
    Ember.run.schedule 'afterRender', ->
      that.InitData()
    return

  InitData:->
    that = @
    loading = @LoadModel()
    loading.then (model)->
      that.WalkModel model
    return

  LoadModel:->
    storage = @get 'storage'
    modelName = @get 'model-name'
    loading = storage.findAll modelName
    return loading

  WalkModel:(model)->
    items = model.toArray()
    mas = []
    for item in items
      activeClass = ''
      activeClass = 'active' if item.get('route') is @GetCurrentPath()
      Ember.set item, 'activeClass', activeClass
      mas.push item
    @set 'data', mas
    @GetCurrentPath()
    return


  GetCurrentPath:->
    app = @container.lookup('controller:application')
    return app.get 'currentPath'

  actions:
    selectItem:(item)->
      @InitData()
      return

`export default QMenuComponent`
