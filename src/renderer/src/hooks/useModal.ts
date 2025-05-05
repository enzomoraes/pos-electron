import { useState, useCallback } from 'react'

export function useModal(): {
  isOpen: boolean
  open: () => void
  close: () => void
} {
  const [isOpen, setIsOpen] = useState(false)
  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  return { isOpen, open, close }
}
