import type { Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { SaleItem } from 'src/main/entities/SaleItem'

export interface SaleInfo {
  clientName: string
  paymentMethod: 'dinheiro' | 'cartão' | 'pix'
}

interface SaleContextType {
  cart: SaleItem[]
  setCart: Dispatch<SetStateAction<SaleItem[]>>
}

export const SaleContext = createContext<SaleContextType>({
  cart: [],
  setCart: () => {}
})
