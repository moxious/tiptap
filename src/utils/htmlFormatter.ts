/**
 * Formats HTML with proper indentation for better readability
 * @param html - Raw HTML string to format
 * @returns Formatted HTML string with proper indentation
 */
export function formatHTML(html: string): string {
  try {
    let formatted = ''
    let indent = 0
    const tab = '  '
    
    // Split by tags
    const tokens = html.split(/(<[^>]+>)/g).filter(token => token.trim())
    
    tokens.forEach((token) => {
      if (token.startsWith('</')) {
        // Closing tag
        indent = Math.max(0, indent - 1)
        formatted += tab.repeat(indent) + token + '\n'
      } else if (token.startsWith('<')) {
        // Opening tag
        const isVoidElement = /^<(br|hr|img|input|meta|link)[^>]*>$/i.test(token)
        const isSelfClosing = token.endsWith('/>')
        
        formatted += tab.repeat(indent) + token + '\n'
        
        if (!isVoidElement && !isSelfClosing && !token.startsWith('<!')) {
          indent++
        }
      } else {
        // Text content
        const trimmed = token.trim()
        if (trimmed) {
          formatted += tab.repeat(indent) + trimmed + '\n'
        }
      }
    })
    
    return formatted.trim()
  } catch (e) {
    // Fallback to unformatted HTML if formatting fails
    return html
  }
}

