import { useCallback, useContext, useMemo } from 'react'
import { toast } from 'react-toastify'
import { Product } from '../../../main/entities/Product'
import { Sale } from '../../../main/entities/Sale'
import { SaleItem } from '../../../main/entities/SaleItem'
import { SaleContext, SaleInfo } from '../contexts/SaleContext'
import { useProducts } from './useProducts'
import { useSales } from './useSales'

export function useCart(): {
  cart: SaleItem[]
  addToCart: (product: Product) => void
  increaseQuantity: (id: number) => void
  decreaseQuantity: (id: number) => void
  updateQuantity: (id: number, value: number) => void
  changePrice: (id: number, newPriceCents: number) => void
  clearCart: () => void
  closeSale: (sale: SaleInfo) => void
  products: Product[]
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>
  total: number
} {
  const { products, setProducts, refreshProducts } = useProducts()

  const { cart, setCart } = useContext(SaleContext)
  const { printSale } = useSales()

  const addToCart = useCallback(
    (product: Product) => {
      if (product.stock <= 0) {
        toast.warn(`${product.name} is out of stock!`)
        return
      }
      const quantityToIncrease = Math.min(product.stock, 1)
      setCart((prev: SaleItem[]) => {
        const existing = prev.find((item) => item.product.id === product.id)
        if (existing) {
          return prev.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + quantityToIncrease }
              : item
          )
        }
        return [
          ...prev,
          {
            product,
            price: product.price,
            quantity: 1,
            totalPrice: product.price,
            id: undefined as unknown as number,
            sale: {} as Sale
          }
        ]
      })
      // diminuir estoque
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, stock: p.stock - quantityToIncrease } : p))
      )
    },
    [setCart, setProducts]
  )

  const increaseQuantity = useCallback(
    (id: number) => {
      const product = products.find((p) => p.id === id)
      const item = cart.find((i) => i.product.id === id)
      if (!product || !item) return

      if (product.stock <= 0) {
        toast.warn('No more stock available!')
        return
      }

      const quantityToIncrease = Math.min(product.stock, 1)

      setCart((prev) =>
        prev.map((i) =>
          i.product.id === id ? { ...i, quantity: i.quantity + quantityToIncrease } : i
        )
      )
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: p.stock - quantityToIncrease } : p))
      )
    },
    [setCart, cart, products, setProducts]
  )

  const decreaseQuantity = useCallback(
    (id: number) => {
      const item = cart.find((i) => i.product.id === id)
      if (!item) return
      const quantityToDecrease = Math.min(item.quantity, 1)

      setCart((prev) =>
        prev.flatMap((i) =>
          i.product.id === id
            ? i.quantity <= 1
              ? []
              : [{ ...i, quantity: i.quantity - quantityToDecrease }]
            : [i]
        )
      )
      // restaurar estoque
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: p.stock + quantityToDecrease } : p))
      )
    },
    [setCart, cart, setProducts]
  )

  const updateQuantity = useCallback(
    (id: number, value: number) => {
      if (value < 0) return

      const product = products.find((p) => p.id === id)
      const item = cart.find((i) => i.product.id === id)
      if (!product || !item) return

      // estoque atual + quantidade no carrinho
      const available = product.stock + item.quantity
      const newQty = Math.min(value, available)
      const delta = newQty - item.quantity

      setCart((prev) => prev.map((i) => (i.product.id === id ? { ...i, quantity: newQty } : i)))
      // ajustar estoque: diminuir ou restaurar conforme delta
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, stock: p.stock - delta } : p)))
    },
    [setCart, cart, products, setProducts]
  )

  const changePrice = useCallback(
    (id: number, newPriceCents: number) => {
      if (isNaN(newPriceCents) || newPriceCents < 0) {
        toast.error('Invalid price')
        return
      }
      setCart((prev) =>
        prev.map((item) => (item.product.id === id ? { ...item, price: newPriceCents } : item))
      )
    },
    [setCart]
  )

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price * item.quantity) / 100, 0),
    [cart]
  )

  const clearCart = useCallback(() => {
    refreshProducts()
    setCart([])
  }, [setCart, refreshProducts])

  const closeSale = useCallback(
    async (sale: SaleInfo) => {
      if (cart.length === 0) {
        toast.warn('Cart is empty. Add products before closing the sale.')
        return
      }
      console.log('Closing sale with cart and sale', cart, sale)
      try {
        const response = await window.api.sell({
          items: cart.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.price
          })),
          info: {
            clientName: sale.clientName,
            paymentMethod: sale.paymentMethod
          }
        })
        printSale(response.id)
        toast.success('Sale completed successfully!')
        clearCart()
        refreshProducts()
      } catch (err) {
        console.error(err)
        toast.error('Error completing sale. Please try again.')
      }
    },
    [cart, clearCart, printSale, refreshProducts]
  )

  return {
    cart,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    changePrice,
    clearCart,
    closeSale,
    products,
    setProducts,
    total
  }
}
