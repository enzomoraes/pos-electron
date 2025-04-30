import React, { useState, useCallback } from 'react'
import { toast } from 'react-toastify'
import { useProducts } from '../hooks/useProducts'
import { useCart } from '../hooks/useCart'
import { useSaleShortcuts } from '../hooks/useSalesShortcuts'

const PointOfSale: React.FC = () => {
  const { products, setProducts, refreshProducts } = useProducts()
  const {
    cart,
    addToCart,
    clearCart: clearCartHook,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    changePrice,
    closeSale: closeSaleHook,
    total
  } = useCart(products, setProducts)

  const [editingPriceId, setEditingPriceId] = useState<number | null>(null)
  const [priceInputValue, setPriceInputValue] = useState<string>('')
  const [editingQtyId, setEditingQtyId] = useState<number | null>(null)
  const [qtyInputValue, setQtyInputValue] = useState<string>('')

  // Wrap clear and sale to also refresh products
  const handleClearCart = useCallback(() => {
    clearCartHook()
    refreshProducts()
  }, [clearCartHook, refreshProducts])

  const handleCloseSale = useCallback(() => {
    closeSaleHook()
    refreshProducts()
  }, [closeSaleHook, refreshProducts])

  // Keyboard shortcuts
  useSaleShortcuts(handleClearCart, handleCloseSale)

  // Price editing handlers
  const handlePriceClick = useCallback((id: number, unitPrice: number) => {
    setEditingPriceId(id)
    setPriceInputValue(unitPrice.toFixed(2))
  }, [])

  const commitPriceChange = useCallback(
    (itemId: number) => {
      if (priceInputValue.trim() === '' || isNaN(Number(priceInputValue))) {
        toast.error('Invalid price')
        return
      }
      const newUnitPrice = Number(priceInputValue)
      changePrice(itemId, Math.round(newUnitPrice * 100))
      setEditingPriceId(null)
    },
    [priceInputValue, changePrice]
  )

  // Quantity editing handlers
  const handleQtyClick = useCallback((id: number, quantity: number) => {
    setEditingQtyId(id)
    setQtyInputValue(quantity.toString())
  }, [])

  const commitQtyChange = useCallback(
    (itemId: number) => {
      const val = Number(qtyInputValue)
      if (qtyInputValue.trim() === '' || isNaN(val) || val < 0) {
        toast.error('Invalid quantity')
        return
      }
      updateQuantity(itemId, val)
      setEditingQtyId(null)
    },
    [qtyInputValue, updateQuantity]
  )

  return (
    <div
      style={{
        padding: '40px',
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        color: '#f1f1f1'
      }}
    >
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
              border: '1px solid #333',
              borderRadius: '10px',
              padding: '15px',
              textAlign: 'center',
              backgroundColor: product.stock > 0 ? '#1e1e1e' : '#2c2c2c',
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)'
            }}
          >
            <h3 style={{ marginBottom: '10px', fontSize: '18px', color: '#fff' }}>
              {product.name
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </h3>
            <p style={{ marginBottom: '8px', fontWeight: 'bold', color: '#4caf50' }}>
              R${(product.price / 100).toFixed(2)}
            </p>
            <p style={{ marginBottom: '15px', color: '#ccc' }}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock <= 0}
              style={{
                backgroundColor: product.stock > 0 ? '#4caf50' : '#555',
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
          borderTop: '2px solid #333'
        }}
      >
        <h2 style={{ marginBottom: '20px' }}>Cart</h2>
        {cart.length === 0 ? (
          <p style={{ color: '#aaa' }}>Your cart is empty.</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, marginBottom: '20px' }}>
            {cart.map((item) => {
              const unitPrice = item.price / 100
              return (
                <li
                  key={item.product.id}
                  style={{
                    marginBottom: '10px',
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    alignItems: 'center',
                    textAlign: 'left',
                    gap: '10px',
                    fontSize: '16px'
                  }}
                >
                  <span>{item.product.name}</span>

                  {/* Quantity with commit-on-blur */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      onClick={() => decreaseQuantity(item.product.id)}
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

                    {editingQtyId === item.product.id ? (
                      <input
                        type="number"
                        step="0.5"
                        value={qtyInputValue}
                        onChange={(e) => setQtyInputValue(e.target.value)}
                        onBlur={() => commitQtyChange(item.product.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') commitQtyChange(item.product.id)
                          if (e.key === 'Escape') setEditingQtyId(null)
                        }}
                        style={{ width: '60px', textAlign: 'center', padding: '4px', fontSize: '16px' }}
                        autoFocus
                      />
                    ) : (
                      <span
                        onClick={() => handleQtyClick(item.product.id, item.quantity)}
                        style={{ width: '60px', display: 'inline-block', textAlign: 'center', cursor: 'pointer', color: '#4caf50' }}
                      >
                        {item.quantity}
                      </span>
                    )}

                    <button
                      onClick={() => increaseQuantity(item.product.id)}
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

                  {/* Price */}
                  {editingPriceId === item.product.id ? (
                    <input
                      type="number"
                      step="0.01"
                      value={priceInputValue}
                      onChange={(e) => setPriceInputValue(e.target.value)}
                      onBlur={() => commitPriceChange(item.product.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitPriceChange(item.product.id)
                        if (e.key === 'Escape') setEditingPriceId(null)
                      }}
                      style={{ width: '80px', textAlign: 'center', padding: '4px', fontSize: '16px' }}
                      autoFocus
                    />
                  ) : (
                    <span
                      onClick={() => handlePriceClick(item.product.id, unitPrice)}
                      style={{ cursor: 'pointer', color: '#4caf50' }}
                    >
                      R${unitPrice.toFixed(2)}
                    </span>
                  )}

                  <span>R${(unitPrice * item.quantity).toFixed(2)}</span>
                </li>
              )
            })}
          </ul>
        )}
        <h3 style={{ marginBottom: '20px', color: '#4caf50' }}>Total: R${total.toFixed(2)}</h3>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={handleClearCart}
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
            onClick={handleCloseSale}
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
