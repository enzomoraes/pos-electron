import { SaleContext } from '@renderer/contexts/SaleContext'
import { useState } from 'react'
import { SaleItem } from 'src/main/entities/SaleItem'

export const SaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<SaleItem[]>([])

  return <SaleContext.Provider value={{ cart, setCart }}>{children}</SaleContext.Provider>
}
