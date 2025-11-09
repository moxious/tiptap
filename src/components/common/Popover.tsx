import { ReactNode, RefObject, useRef, useEffect } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useEscapeKey } from '../../hooks/useKeyboardShortcut'

export interface PopoverProps {
  isOpen: boolean
  onClose: () => void
  anchorEl: HTMLElement | null
  children: ReactNode
  className?: string
  showBackdrop?: boolean
  ariaLabel?: string
  ariaLabelledBy?: string
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
  showBackdrop = true,
  ariaLabel,
  ariaLabelledBy
}: PopoverProps) => {
  const popoverRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Focus trap: Keep focus within popover when open
  useEffect(() => {
    if (!isOpen || !popoverRef.current) return

    // Store the element that had focus before opening
    previousFocusRef.current = document.activeElement as HTMLElement

    // Get all focusable elements within the popover
    const focusableElements = popoverRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element when popover opens
    if (firstElement) {
      setTimeout(() => firstElement.focus(), 0)
    }

    // Trap focus within popover
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab: If focused on first element, move to last
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab: If focused on last element, move to first
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)

    // Restore focus when closing
    return () => {
      document.removeEventListener('keydown', handleTabKey)
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])

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

  if (!isOpen || !anchorEl) {
    return null
  }

  // Calculate position based on anchor element
  const rect = anchorEl.getBoundingClientRect()
  
  // If anchor is a large container (like editor-wrapper), use viewport-centered positioning
  // instead of positioning at the bottom of the container (which would be off-screen)
  const isLargeContainer = anchorEl.classList.contains('editor-wrapper')
  
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
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
      >
        {children}
      </div>
    </>
  )
}

export default Popover

