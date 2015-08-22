JSON_DATA =
  items: [
    {
      'name': 'index'
      'route': 'index'
    }
    {
      'name': 'products'
      'route': 'products'
    }
    {
      'name': 'info'
      'route': 'info'
    }
    {
      'name': 'about'
      'route': 'about'
    }
  ]

Init=(container, application)->
  new Promise (resolve, reject) ->
    store = container.lookup 'service:store'
    menu = store.findAll 'q-menu'
    menu.then (model) ->
      items = model.toArray()
      if items.length is 0
        __items = Ember.get JSON_DATA, 'items'
        promises = []
        for item in __items
          row = store.createRecord 'q-menu',
            'name': Ember.get(item, 'name')
            'route': Ember.get(item, 'route')
          promises.push row.save()
        Promise.all(promises).then (t) ->
          resolve true
          Ember.debug 'Save menu'
      else
        resolve true



TruncateModel=(modelName, container)->
  store = container.lookup 'service:store'
  new Promise (resolve, reject) ->
    modelLoading = store.findAll modelName
    modelLoading.then (model)->
      items = model.toArray()
      promises = []
      for item in items
        item.deleteRecord()
        promises.push item.save()
      Promise.all(promises).then (t) ->
        resolve model
        Ember.debug 'Truncate menu'


QMenuInitializer =
  name: 'q-menu'
  after: 'store'
  initialize: (container, application)->
    application.deferReadiness()
    load = Init container, application
    load.then (m) ->
      application.advanceReadiness()
    return


`export default QMenuInitializer`
