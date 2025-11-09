/**
 * Factory functions for creating node views with interactive elements
 */

export interface NodeViewConfig {
  tagName: keyof HTMLElementTagNameMap
  showLightning?: boolean
  contentDisplay?: 'contents' | 'inline' | 'block'
}

/**
 * Creates a lightning bolt element for interactive nodes
 */
export function createLightningBolt(): HTMLSpanElement {
  const lightning = document.createElement('span')
  lightning.className = 'interactive-lightning'
  lightning.textContent = '⚡'
  return lightning
}

/**
 * Applies HTML attributes to a DOM element
 */
export function applyAttributes(
  element: HTMLElement,
  attributes: Record<string, any>
): void {
  Object.entries(attributes).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      element.setAttribute(key, String(value))
    }
  })
}

/**
 * Creates an interactive node view with lightning bolt indicator
 * @param config - Configuration for the node view
 * @param attributes - HTML attributes to apply
 * @param shouldShowLightning - Function to determine if lightning should be shown
 */
export function createInteractiveNodeView(
  config: NodeViewConfig,
  attributes: Record<string, any>,
  shouldShowLightning?: (attrs: Record<string, any>) => boolean
): { dom: HTMLElement; contentDOM: HTMLElement } {
  const { tagName, contentDisplay = 'contents' } = config
  
  const dom = document.createElement(tagName)
  applyAttributes(dom, attributes)

  // Determine if we should show the lightning bolt
  const showLightning = shouldShowLightning 
    ? shouldShowLightning(attributes)
    : config.showLightning !== false

  if (showLightning) {
    const lightning = createLightningBolt()
    dom.appendChild(lightning)
  }

  // Create content wrapper
  const contentDOM = document.createElement(
    tagName === 'li' || tagName === 'span' ? 'div' : 'span'
  )
  
  if (contentDisplay === 'contents') {
    contentDOM.style.display = 'contents'
  } else if (contentDisplay === 'inline') {
    contentDOM.style.display = 'inline'
  }
  
  dom.appendChild(contentDOM)

  return { dom, contentDOM }
}

/**
 * Creates a node view specifically for list items
 */
export function createListItemNodeView(
  attributes: Record<string, any>
): { dom: HTMLElement; contentDOM: HTMLElement } {
  return createInteractiveNodeView(
    { tagName: 'li', contentDisplay: 'contents' },
    attributes,
    (attrs) => attrs.class?.includes('interactive')
  )
}

/**
 * Creates a node view specifically for inline spans
 */
export function createSpanNodeView(
  attributes: Record<string, any>,
  showLightning: boolean = true
): { dom: HTMLElement; contentDOM: HTMLElement } {
  const dom = document.createElement('span')
  applyAttributes(dom, attributes)

  if (showLightning) {
    const lightning = createLightningBolt()
    dom.appendChild(lightning)
  }

  const contentDOM = document.createElement('span')
  dom.appendChild(contentDOM)

  return { dom, contentDOM }
}

/**
 * Creates a node view for sequence sections (block-level spans)
 */
export function createSequenceSectionNodeView(
  attributes: Record<string, any>
): { dom: HTMLElement; contentDOM: HTMLElement } {
  const dom = document.createElement('span')
  applyAttributes(dom, attributes)

  const lightning = createLightningBolt()
  dom.appendChild(lightning)

  const contentDOM = document.createElement('div')
  contentDOM.style.display = 'contents'
  dom.appendChild(contentDOM)

  return { dom, contentDOM }
}

