/* eslint-env jest */
import { withContext } from '../src/index'

const Component = withContext(HTMLElement)

const ProviderComponent = class extends Component {
  static providedContexts = {
    valueContext: { value: 'value' },
    propertyContext: { property: 'myProp' }
  }

  myProp = 'test'
}

const ConsumerComponent = class extends Component {
  static observedContexts = ['valueContext', 'propertyContext']
}

customElements.define('mixin-component', Component)
customElements.define('mixin-provider-component', ProviderComponent)
customElements.define('mixin-consumer-component', ConsumerComponent)

// unable to create custom elements with jsdom
describe('withContext', () => {
  let rootEl
  let grandfatherEl
  let parentEl
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="root">
        <div id="grandfather">
          <div id="parent">            
          </div>
          <div id="parent2">            
          </div>
        </div>
      </div>
    `
    rootEl = document.getElementById('root')
    grandfatherEl = document.getElementById('grandfather')    
    parentEl = document.getElementById('parent')
  })

  test('should define a context property in element', () => {
    const el = new Component()
    expect(el.context).toBeDefined()
  })

  describe('with providedContexts static property', () => {
    let el    

    beforeEach(() => {
      el = new ProviderComponent()
      el.appendChild(grandfatherEl)
      rootEl.appendChild(el)
    })

    test('should provide contexts to child element', async () => {
      const childEl = new ConsumerComponent()
      parentEl.appendChild(childEl)
      await Promise.resolve()
      expect(childEl.context.valueContext).toBe('value')
      expect(childEl.context.propertyContext).toBe('test')       
    })
  })
})
