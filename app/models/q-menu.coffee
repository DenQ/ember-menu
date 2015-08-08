`import DS from 'ember-data'`

QMenuModel = DS.Model.extend
  name  : DS.attr 'string'
  route : DS.attr 'string'

`export default QMenuModel`
