/// <reference types="vite/client" />
export { }
declare global {
  interface Window {
    api: {
      getProducts: () => Promise<{ id: number; name: string; price: number; stock: number }[]>
      getProduct: (productId: number) => Promise<{ id: number; name: string; price: number; stock: number }>
      createProduct: (productData: { name: string; price: number; stock: number }) => Promise<{ name: string; price: number; stock: number }>
      updateProduct: (productId: number, productData: { name: string; price: number; stock: number }) => Promise<{ name: string; price: number; stock: number }>
      removeProduct: (productId: number) => Promise<void>
    }
  }
}