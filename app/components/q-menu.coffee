`import Ember from 'ember'`

QMenuComponent = Ember.Component.extend
  storage: Ember.inject.service('store')
  'model-name': ''

  didInsertElement:(etc...)->
    @_super etc
    storage = @get 'storage'
    modelName = @get 'model-name'
    storage.createRecord modelName,
      'name': '1'
      'route': '2'
    return


`export default QMenuComponent`
