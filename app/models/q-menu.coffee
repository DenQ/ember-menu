`import DS from 'ember-data'`

QMenuModel = DS.Model.extend
  name  : DS.attr 'string'
  route : DS.attr 'string'
  children: DS.belongsTo 'q-menu',
    inverse: 'parent'
  parent: DS.belongsTo 'q-menu',
    inverse: 'children'

`export default QMenuModel`
