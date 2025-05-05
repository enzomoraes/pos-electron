import { SaleInfo, SaleContext } from '@renderer/contexts/SaleContext'
import { useState } from 'react'
import { SaleItem } from 'src/main/entities/SaleItem'

export const SaleProvider = ({ children }: { children: React.ReactNode }) => {
  const [sale, setSale] = useState<SaleInfo>({
    clientName: '',
    paymentMethod: 'pix'
  })
  const [cart, setCart] = useState<SaleItem[]>([])

  return (
    <SaleContext.Provider value={{ sale, setSale, cart, setCart }}>{children}</SaleContext.Provider>
  )
}
