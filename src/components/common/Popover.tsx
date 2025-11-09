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

  if (!isOpen || !anchorEl) {
    return null
  }

  // Calculate position based on anchor element
  const rect = anchorEl.getBoundingClientRect()
  const style: React.CSSProperties = {
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

