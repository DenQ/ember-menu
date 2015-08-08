`import DS from 'ember-data'`

QMenu = DS.Model.extend
  name  : DS.attr 'string'
  route : DS.attr 'string'

`export default QMenu`
