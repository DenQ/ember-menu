`import { test, moduleForComponent } from 'ember-qunit'`
`import hbs from 'htmlbars-inline-precompile'`

moduleForComponent 'q-tmp', 'Integration | Component | q tmp', {
  integration: true
}

test 'it renders', (assert) ->
  assert.expect 2

  # Set any properties with @set 'myProperty', 'value'
  # Handle any actions with @on 'myAction', (val) ->

  @render hbs """{{q-tmp}}"""

  assert.equal @$().text().trim(), ''

  # Template block usage:
  @render hbs """
    {{#q-tmp}}
      template block text
    {{/q-tmp}}
  """

  assert.equal @$().text().trim(), 'template block text'
