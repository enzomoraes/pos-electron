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
      }) => Promise<Sale>
      getSales: () => Promise<Sale[]>
      getSale: (id: number) => Promise<Sale>
      print: (message: string) => Promise<void>
    }
  }
}
