import { ReactNode, RefObject, useRef } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useEscapeKey } from '../../hooks/useKeyboardShortcut'

export interface PopoverProps {
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  children: ReactNode
  className?: string
  showBackdrop?: boolean
}

/**
 * Generic popover component that handles positioning, backdrop, and outside clicks
 * Extracted from duplicated logic in InteractiveSettingsPopover and SequencePopover
 */
const Popover = ({ 
  isOpen, 
  onClose, 
  anchorEl, 
  children, 
  className = '',
  showBackdrop = true 
}: PopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Handle click outside
  useClickOutside(
    popoverRef,
    (event: MouseEvent) => {
      // If anchor is document.body, close on any outside click
      // Otherwise, also check if click is outside anchor
      if (anchorEl === document.body || (anchorEl && !anchorEl.contains(event.target as Node))) {
        onClose()
      }
    },
    isOpen
  )

  // Handle escape key
  useEscapeKey(onClose, isOpen)

  // Debug logging
  console.log('🪟 [Popover] Render check:', {
    isOpen,
    anchorEl,
    willRender: isOpen && !!anchorEl,
  })

  if (!isOpen || !anchorEl) {
    return null
  }

  // Calculate position based on anchor element
  const rect = anchorEl.getBoundingClientRect()
  
  // If anchor is a large container (like editor-wrapper), use viewport-centered positioning
  // instead of positioning at the bottom of the container (which would be off-screen)
  const isLargeContainer = anchorEl.classList.contains('editor-wrapper')
  
  console.log('🪟 [Popover] Positioning:', {
    anchorClasses: anchorEl.className,
    isLargeContainer,
    rect: { bottom: rect.bottom, left: rect.left, height: rect.height },
  })
  
  const style: React.CSSProperties = isLargeContainer
    ? {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)', // Center in viewport
        zIndex: 1000,
      }
    : {
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        left: `${rect.left}px`,
        zIndex: 1000,
      }

  return (
    <>
      {showBackdrop && <div className="popover-backdrop" />}
      <div 
        ref={popoverRef} 
        className={`interactive-settings-popover ${className}`} 
        style={style}
      >
        {children}
      </div>
    </>
  )
}

export default Popover

