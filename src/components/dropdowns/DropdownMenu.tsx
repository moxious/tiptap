import { useState, useRef, ReactNode } from 'react'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useEscapeKey } from '../../hooks/useKeyboardShortcut'
import './DropdownMenu.css'

interface DropdownMenuProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'left' | 'right'
}

const DropdownMenu = ({ trigger, children, align = 'left' }: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  // Handle click outside both dropdown and trigger
  useClickOutside(
    dropdownRef,
    (event: MouseEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    },
    isOpen
  )

  // Handle escape key
  useEscapeKey(() => setIsOpen(false), isOpen)

  const handleTriggerClick = () => {
    setIsOpen(!isOpen)
  }

  const handleItemClick = () => {
    setIsOpen(false)
  }

  return (
    <div className="dropdown-container">
      <button
        ref={triggerRef}
        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
        onClick={handleTriggerClick}
        type="button"
      >
        {trigger}
      </button>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`dropdown-menu ${align}`}
          onClick={handleItemClick}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default DropdownMenu

