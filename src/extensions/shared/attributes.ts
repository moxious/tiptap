/**
 * Shared attribute definitions for interactive Tiptap extensions
 * These attributes are used across multiple custom node/mark types
 */

/**
 * Creates the standard 'class' attribute configuration
 */
export function createClassAttribute(defaultValue: string | null = null) {
  return {
    default: defaultValue,
    parseHTML: (element: HTMLElement) => element.getAttribute('class'),
    renderHTML: (attributes: Record<string, any>) => {
      if (!attributes.class) {
        return {}
      }
      return { class: attributes.class }
    },
  }
}

/**
 * Creates the standard 'id' attribute configuration
 */
export function createIdAttribute() {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute('id'),
    renderHTML: (attributes: Record<string, any>) => {
      if (!attributes.id) {
        return {}
      }
      return { id: attributes.id }
    },
  }
}

/**
 * Creates the 'data-targetaction' attribute configuration
 */
export function createTargetActionAttribute(defaultValue: string | null = null) {
  return {
    default: defaultValue,
    parseHTML: (element: HTMLElement) => element.getAttribute('data-targetaction'),
    renderHTML: (attributes: Record<string, any>) => {
      if (!attributes['data-targetaction']) {
        return {}
      }
      return { 'data-targetaction': attributes['data-targetaction'] }
    },
  }
}

/**
 * Creates the 'data-reftarget' attribute configuration
 */
export function createRefTargetAttribute() {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute('data-reftarget'),
    renderHTML: (attributes: Record<string, any>) => {
      if (!attributes['data-reftarget']) {
        return {}
      }
      return { 'data-reftarget': attributes['data-reftarget'] }
    },
  }
}

/**
 * Creates the 'data-requirements' attribute configuration
 */
export function createRequirementsAttribute() {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute('data-requirements'),
    renderHTML: (attributes: Record<string, any>) => {
      if (!attributes['data-requirements']) {
        return {}
      }
      return { 'data-requirements': attributes['data-requirements'] }
    },
  }
}

/**
 * Creates the 'data-doit' attribute configuration
 */
export function createDoItAttribute() {
  return {
    default: null,
    parseHTML: (element: HTMLElement) => element.getAttribute('data-doit'),
    renderHTML: (attributes: Record<string, any>) => {
      if (!attributes['data-doit']) {
        return {}
      }
      return { 'data-doit': attributes['data-doit'] }
    },
  }
}

/**
 * Returns the complete set of interactive attributes
 */
export function getInteractiveAttributes() {
  return {
    class: createClassAttribute('interactive'),
    id: createIdAttribute(),
    'data-targetaction': createTargetActionAttribute(),
    'data-reftarget': createRefTargetAttribute(),
    'data-requirements': createRequirementsAttribute(),
    'data-doit': createDoItAttribute(),
  }
}

/**
 * Returns a subset of interactive attributes (without id and data-doit)
 */
export function getBasicInteractiveAttributes() {
  return {
    class: createClassAttribute('interactive'),
    'data-targetaction': createTargetActionAttribute(),
    'data-reftarget': createRefTargetAttribute(),
    'data-requirements': createRequirementsAttribute(),
  }
}

