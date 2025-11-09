import { useState, useCallback } from 'react'

/**
 * State for a single popover
 */
export interface PopoverState {
  isOpen: boolean
  anchorEl: HTMLElement | null
}

/**
 * Manager for coordinating multiple popovers
 * Ensures only one popover is open at a time
 */
export function usePopoverManager<T extends string>(popoverIds: T[]) {
  const [popovers, setPopovers] = useState<Record<T, PopoverState>>(() => {
    const initial = {} as Record<T, PopoverState>
    popoverIds.forEach(id => {
      initial[id] = { isOpen: false, anchorEl: null }
    })
    return initial
  })

  /**
   * Open a specific popover (closes others)
   */
  const open = useCallback((id: T, anchor: HTMLElement) => {
    setPopovers(prev => {
      const next = {} as Record<T, PopoverState>
      popoverIds.forEach(popId => {
        next[popId] = {
          isOpen: popId === id,
          anchorEl: popId === id ? anchor : null,
        }
      })
      return next
    })
  }, [popoverIds])

  /**
   * Close a specific popover
   */
  const close = useCallback((id: T) => {
    setPopovers(prev => ({
      ...prev,
      [id]: { isOpen: false, anchorEl: null },
    }))
  }, [])

  /**
   * Close all popovers
   */
  const closeAll = useCallback(() => {
    setPopovers(prev => {
      const next = {} as Record<T, PopoverState>
      popoverIds.forEach(id => {
        next[id] = { isOpen: false, anchorEl: null }
      })
      return next
    })
  }, [popoverIds])

  /**
   * Toggle a specific popover
   */
  const toggle = useCallback((id: T, anchor: HTMLElement) => {
    setPopovers(prev => {
      const wasOpen = prev[id].isOpen
      const next = {} as Record<T, PopoverState>
      popoverIds.forEach(popId => {
        next[popId] = {
          isOpen: popId === id && !wasOpen,
          anchorEl: popId === id && !wasOpen ? anchor : null,
        }
      })
      return next
    })
  }, [popoverIds])

  return {
    popovers,
    open,
    close,
    closeAll,
    toggle,
  }
}

