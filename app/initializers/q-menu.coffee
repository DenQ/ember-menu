Init=(container, application)->
  store = container.lookup 'service:store'
  menu = store.findAll 'q-menu'

QMenuInitializer =
  name: 'q-menu'
  after: 'store'
  initialize: (container, application)->
    application.deferReadiness()
    Init container, application
    application.advanceReadiness()

`export default QMenuInitializer`
