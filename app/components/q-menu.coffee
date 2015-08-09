`import Ember from 'ember'`

QMenuComponent = Ember.Component.extend
  storage: Ember.inject.service('store')
  'model-name': ''
  data: []

  # переделать
  SetActiveClass:->
    $element = $ @get('element')
    $listLinks = $element.find 'a.active'
    $listLinks.parents('li').addClass 'active'
    return


  didInsertElement:(etc...)->
    @_super etc
    loading = @LoadModel()
    that = @
    loading.then (result) ->
      content = result.content
      that.SetData content
      # переделать
      setTimeout (->
        that.SetActiveClass()
      ), 200

    return

  LoadModel:->
    storage = @get 'storage'
    modelName = @get 'model-name'
    loading = storage.findAll modelName
    return loading

  SetData:(content)->
    mas = []
    for item in content
      obj = item._data
      mas.push obj
    @set 'data', mas
    return

#    console.log loading
#    m = storage.createRecord modelName,
#      'name': 'about'
#      'route': 'about'
#    m.save()
#    return


`export default QMenuComponent`
