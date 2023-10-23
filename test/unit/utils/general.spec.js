import { spy } from 'sinon';
import { Step } from '../../../src/js/step.js';
import { getPopperOptions, parseAttachTo, shouldCenterStep } from '../../../src/js/utils/general.js';

describe('General Utils', () => {
  let optionsElement;

  beforeEach(() => {
    optionsElement = document.createElement('div');
    optionsElement.classList.add('options-test');
    document.body.appendChild(optionsElement);
  });

  afterEach(() => {
    document.body.removeChild(optionsElement);
  });

  describe('parseAttachTo()', () => {
  it('fails if element does not exist', () => {
  const step = new Step({}, {
        attachTo: { element: '.element-does-not-exist', on: 'center' }
      });

      const { element } = parseAttachTo(step);
      expect(element).toBeFalsy();
});

    it('accepts callback function as element', () => {
  const callback = spy();

      const step = new Step({}, {
        attachTo: { element: callback, on: 'center' }
      });

      parseAttachTo(step);
      expect(callback.called).toBe(true);
});

    it('correctly resolves elements when given function that returns a selector', () => {
  const step = new Step({}, {
        attachTo: { element: () => 'body', on: 'center' }
      });

      const { element } = parseAttachTo(step);
      expect(element).toBe(document.body);
});

    it('binds element callback to step', function() {
      const step = new Step({}, {
        attachTo: {
          element() {
            expect(this).toBe(step);
          },
          on: 'center'
        }
      });

      parseAttachTo(step);
    });
});

  describe('getPopperOptions', () => {
  it('modifiers can be overridden', () => {
  const step = new Step({}, {
        attachTo: { element: '.options-test', on: 'right' },
        popperOptions: {
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                altAxis: false
              }
            }
          ]
        }
      });

      const popperOptions = getPopperOptions(step.options.attachTo, step);
      expect(popperOptions.modifiers[1].options.altAxis).toBe(false);
});

    it('positioning strategy is explicitly set', () => {
  const step = new Step({}, {
        attachTo: { element: '.options-test', on: 'center' },
        options: {
          popperOptions: {
            strategy: 'absolute'
          }
        }
      });

      const popperOptions = getPopperOptions(step.options.attachTo, step);
      expect(popperOptions.strategy).toBe('absolute');
});

    it(`has a modifier to focus on the step's element after render`, () => {
  const step = new Step({}, {
        attachTo: { element: '.options-test', on: 'center' },
      });

      const popperOptions = getPopperOptions(step.options.attachTo, step);

      const expectedModifier = {
        name: 'focusAfterRender',
        enabled: true,
        phase: 'afterWrite',
        fn: expect.any(Function)
      };

      const actualModifier = popperOptions.modifiers.find(
        (modifier) => modifier.name === expectedModifier.name
      );

      expect(actualModifier).toMatchObject(expectedModifier);
});
});

  describe('shouldCenterStep()', () => {
    it('Returns true when resolved attachTo options are falsy', () => {
      const emptyObjAttachTo = {};
      const emptyArrAttachTo = [];
      const nullAttachTo = null; // FAILS Cannot read properties of null (reading 'element')
      const undefAttachTo = undefined; // FAILS Cannot read properties of undefined (reading 'element')

      expect(shouldCenterStep(emptyObjAttachTo)).toBe(true);
      expect(shouldCenterStep(emptyArrAttachTo)).toBe(true);
      expect(shouldCenterStep(nullAttachTo)).toBe(true);
      expect(shouldCenterStep(undefAttachTo)).toBe(true);
    })

    it('Returns false when element and on properties are truthy', () => {
      const testAttachTo = {
        element: '.pseudo',
        on: 'right'
      }

      expect(shouldCenterStep(testAttachTo)).toBe(false)
    })

    it('Returns true when element property is null', () => {
      const elementAttachTo = { element: null}; // FAILS

      expect(shouldCenterStep(elementAttachTo)).toBe(true)
    })
  })
});
