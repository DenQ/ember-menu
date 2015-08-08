`import Ember from 'ember'`
`import QMenuModel from '../models/q-menu'`

IndexRoute = Ember.Route.extend
  init:(etc...)->
    @_super etc
    @store.findAll 'q-menu'
#    model = QMenuModel.create()
    return

`export default IndexRoute`
