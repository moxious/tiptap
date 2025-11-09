import { useState, useRef, useEffect, ReactNode } from 'react'
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [isOpen])

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

