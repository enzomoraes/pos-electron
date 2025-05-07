import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { Sale } from '../main/entities/Sale'

// Custom APIs for renderer
const api = {
  getProducts: () => ipcRenderer.invoke('get-products'),
  createProduct: (productData: { name: string; price: number; stock: number }) =>
    ipcRenderer.invoke('create-product', productData),
  removeProduct: (productId: number) => ipcRenderer.invoke('remove-product', productId),
  updateProduct: (productId: number, productData: { name: string; price: number; stock: number }) =>
    ipcRenderer.invoke('update-product', productId, productData),
  getProduct: (productId: number) => ipcRenderer.invoke('get-product', productId),
  sell: (saleData: {
    items: { productId: number; quantity: number; price: number }[]
    info: { clientName: string; paymentMethod: string }
  }) => ipcRenderer.invoke('sell', saleData),
  getSales: () => ipcRenderer.invoke('get-sales'),
  getSale: (saleId: number) => ipcRenderer.invoke('get-sale', saleId),
  removeSale: (saleId: number) => ipcRenderer.invoke('remove-sale', saleId),
  print: (sale: Sale) => ipcRenderer.invoke('print', sale)
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
