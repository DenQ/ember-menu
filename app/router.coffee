`import Ember from 'ember'`
`import config from './config/environment'`

Router = Ember.Router.extend
  location: config.locationType

Router.map ->
  @route 'index', path: '/'
  @route 'products', path: '/products'
  @route 'info', path: '/info'
  @route 'about', path: '/about'

`export default Router`