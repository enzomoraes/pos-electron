import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const PointOfSale = () => {
  const [products, setProducts] = useState<
    { id: number; name: string; price: number; stock: number }[]
  >([])

  const [cart, setCart] = useState<
    { productId: number; name: string; price: number; quantity: number }[]
  >([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    window.api.getProducts().then((products) => {
      setProducts(products.map((product) => ({ ...product, stock: product.stock / 100 })))
    })
  }, [])

  const addToCart = (product: { id: number; name: string; price: number; stock: number }) => {
    if (product.stock <= 0) {
      toast.warn(`${product.name} is out of stock!`)
      return
    }

    const quantityToIncrease = product.stock < 1 ? product.stock : 1

    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.productId === product.id)
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantityToIncrease }
            : item
        )
      }
      return [
        ...prevCart,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: quantityToIncrease
        }
      ]
    })

    setTotal((prevTotal) => prevTotal + product.price / 100)
    setProducts((prevProducts) =>
      prevProducts.map((item) =>
        item.id === product.id ? { ...item, stock: item.stock - quantityToIncrease } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
    setTotal(0)

    window.api.getProducts().then((products) => {
      setProducts(products.map((product) => ({ ...product, stock: product.stock / 100 })))
    })
  }

  const closeSale = () => {
    if (cart.length === 0) {
      toast.warn('Cart is empty. Add products before closing the sale.')
      return
    }
    window.api
      .sell({
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }))
      })
      .then(() => {
        toast.success('Sale completed successfully!')
        clearCart()
      })
      .catch((err) => {
        console.error(err)
        toast.error('Error completing sale. Please try again.')
      })
  }

  const increaseQuantity = (id: number) => {
    const product = products.find((p) => p.id === id)
    if (!product || product.stock <= 0) {
      toast.warn('No more stock available!')
      return
    }
    const quantityToIncrease = product.stock < 1 ? product.stock : 1

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === id ? { ...item, quantity: item.quantity + quantityToIncrease } : item
      )
    )
    setTotal((prevTotal) => prevTotal + product.price / 100)
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === id ? { ...p, stock: p.stock - quantityToIncrease } : p))
    )
  }

  const decreaseQuantity = (id: number) => {
    const cartItem = cart.find((item) => item.productId === id)
    if (!cartItem) return

    const quantityToDecrease = cartItem.quantity < 1 ? cartItem.quantity : 1

    if (cartItem.quantity === quantityToDecrease) {
      setCart((prevCart) => prevCart.filter((item) => item.productId !== id))
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.productId === id ? { ...item, quantity: item.quantity - quantityToDecrease } : item
        )
      )
    }

    setTotal((prevTotal) => prevTotal - cartItem.price / 100)
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === id ? { ...p, stock: p.stock + quantityToDecrease } : p))
    )
  }

  const updateQuantity = (id: number, value: number) => {
    if (value < 0.5) return

    const product = products.find((p) => p.id === id)
    const cartItem = cart.find((item) => item.productId === id)
    if (!product || !cartItem) return

    const stockAvailable = product.stock + cartItem.quantity // because stock decreased when added to cart
    const quantityToSet = Math.min(value, stockAvailable)

    const quantityDifference = quantityToSet - cartItem.quantity

    setCart((prevCart) =>
      prevCart.map((item) => (item.productId === id ? { ...item, quantity: quantityToSet } : item))
    )

    setTotal((prevTotal) => prevTotal + (product.price / 100) * quantityDifference)

    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === id ? { ...product, stock: product.stock - quantityDifference } : product
      )
    )
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5') {
        event.preventDefault()
        closeSale()
      }
      if (event.key === 'F3') {
        event.preventDefault()
        clearCart()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [cart])

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Desbrava Vendas</h1>

      {/* PRODUCTS GRID */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}
      >
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '15px',
              textAlign: 'center',
              backgroundColor: product.stock > 0 ? '#fff' : '#f5f5f5',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ marginBottom: '10px', fontSize: '18px', color: '#333' }}>
              {product.name
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </h3>
            <p style={{ marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>
              R${(product.price / 100).toFixed(2)}
            </p>
            <p style={{ marginBottom: '15px', color: '#777' }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              style={{
                backgroundColor: product.stock > 0 ? '#4caf50' : '#ccc',
                color: '#fff',
                border: 'none',
                padding: '10px',
                width: '100%',
                borderRadius: '5px',
                cursor: product.stock > 0 ? 'pointer' : 'not-allowed',
                fontSize: '14px'
              }}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      {/* CART */}
      <div
        style={{
          maxWidth: '500px',
          margin: '0 auto',
          textAlign: 'center',
          padding: '20px',
          borderTop: '2px solid #eee'
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
            {cart.map((item) => (
              <li
                key={item.productId}
                style={{
                  marginBottom: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '16px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.name}</span>

                  <button
                    onClick={() => decreaseQuantity(item.productId)}
                    style={{
                      backgroundColor: '#ccc',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    –
                  </button>
                  <input
                    type="number"
                    value={item.quantity}
                    step="0.5"
                    onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                    style={{
                      width: '60px',
                      textAlign: 'center',
                      padding: '4px',
                      fontSize: '16px'
                    }}
                  />

                  <button
                    onClick={() => increaseQuantity(item.productId)}
                    style={{
                      backgroundColor: '#ccc',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      cursor: 'pointer',
                      fontWeight: 'bold'
                    }}
                  >
                    +
                  </button>
                </div>

                <span>R${((item.price * item.quantity) / 100).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
        <h3 style={{ marginBottom: '20px' }}>Total: R${total.toFixed(2)}</h3>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={clearCart}
            style={{
              backgroundColor: '#ff4d4d',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Clear Cart (F3)
          </button>
          <button
            onClick={closeSale}
            style={{
              backgroundColor: '#4caf50',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Close Sale (F5)
          </button>
        </div>
      </div>
    </div>
  )
}

export default PointOfSale
