import { useCallback, useEffect, useState } from 'react'
import { Product } from '../../../main/entities/Product'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])

  const fetchProducts = useCallback(async () => {
    const prods = await window.api.getProducts()
    setProducts(prods.map((p) => ({ ...p, stock: p.stock / 100 })))
  }, [])

  const removeProduct = useCallback(
    async (productId: number) => {
      await window.api.removeProduct(productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
    },
    [setProducts]
  )

  const createProduct = useCallback(
    async (product: { name: string; price: number; stock: number }) => {
      const newProduct = {
        ...product,
        price: product.price * 100,
        stock: product.stock * 100
      }
      await window.api.createProduct(newProduct)
    },
    []
  )

  const updateProduct = useCallback(
    async (id: number, product: { name: string; price: number; stock: number }) => {
      const updatedProduct = {
        ...product,
        price: product.price * 100,
        stock: product.stock * 100
      }
      await window.api.updateProduct(id, updatedProduct)
    },
    []
  )

  const fetchProductById = useCallback(
    async (id: number) => {
      const product = await window.api.getProduct(id)
      return {
        ...product,
        price: product.price / 100,
        stock: product.stock / 100
      }
    },
    [products]
  )

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return {
    products,
    setProducts,
    refreshProducts: fetchProducts,
    removeProduct,
    createProduct,
    updateProduct,
    fetchProductById
  }
}
