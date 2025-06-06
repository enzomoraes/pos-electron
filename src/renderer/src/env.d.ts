/// <reference types="vite/client" />

import { Product } from '../../main/entities/Product'

export {}
declare global {
  interface Window {
    api: {
      getProducts: () => Promise<Product[]>
      getProduct: (productId: number) => Promise<Product>
      createProduct: (productData: {
        name: string
        price: number
        stock: number
      }) => Promise<{ name: string; price: number; stock: number }>
      updateProduct: (
        productId: number,
        productData: { name: string; price: number; stock: number }
      ) => Promise<{ name: string; price: number; stock: number }>
      removeProduct: (productId: number) => Promise<void>
      sell: (saleData: {
        items: { productId: number; quantity: number; price: number }[]
        info: {
          clientName: string
          paymentMethod: 'dinheiro' | 'cartão' | 'pix'
        }
      }) => Promise<Sale>
      getSales: (salesDate?: string) => Promise<Sale[]>
      getSale: (id: number) => Promise<Sale>
      removeSale: (id: number) => Promise<void>
      print: (message: string) => Promise<void>
      getVersion: () => Promise<string>
    }
  }
}
