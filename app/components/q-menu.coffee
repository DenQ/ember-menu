`import Ember from 'ember'`

QMenuComponent = Ember.Component.extend
  storage: Ember.inject.service('store')
  'model-name': ''
  data: {}

  didInsertElement:(etc...)->
    @_super etc
    storage = @get 'storage'
    modelName = @get 'model-name'
    loading = storage.findAll modelName
    that = @
    loading.then (result) ->
      content = result.content
#      data = that.get 'data'
      mas = []
      for item in content
        obj = item._data
        mas.push obj
      that.set 'data', mas
#      console.log content
    return
#    console.log loading
#    m = storage.createRecord modelName,
#      'name': 'about'
#      'route': 'about'
#    m.save()
#    return


`export default QMenuComponent`
