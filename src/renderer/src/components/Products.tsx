import { useCallback, useEffect } from 'react'
import { confirmAlert } from 'react-confirm-alert'
import { useNavigate } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'

const Products = () => {
  const navigate = useNavigate()
  const { products, setProducts, refreshProducts, removeProduct } = useProducts()

  useEffect(() => {
    refreshProducts()
  }, [])

  const handleUpdateClick = useCallback(
    (productId: number) => {
      navigate(`/products/${productId}`)
    },
    [navigate]
  )

  const handleRemoveClick = useCallback(
    (productId: number) => {
      confirmAlert({
        title: 'Remover produto',
        message: 'Tem certeza que deseja remover este produto?',
        buttons: [
          {
            label: 'Sim',
            onClick: () => removeProduct(productId)
          },
          {
            label: 'Não',
            onClick: () => {}
          }
        ]
      })
    },
    [setProducts]
  )

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        color: '#f1f1f1',
        borderRadius: '8px'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Products</h1>

      <div style={{ textAlign: 'right', marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/products/create')}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: '#2e7d32',
            color: '#fff',
            cursor: 'pointer'
          }}
        >
          + Create Product
        </button>
      </div>

      {products.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#aaa' }}>No products found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((product) => (
            <li
              key={product.id}
              style={{
                backgroundColor: '#1e1e1e',
                padding: '15px',
                borderRadius: '6px',
                marginBottom: '15px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
              }}
            >
              <div>
                <strong>{product.name}</strong>
                <div style={{ fontSize: '14px', color: '#ccc' }}>
                  R${(product.price / 100).toFixed(2)} • Stock: {(product.stock).toFixed(2)}
                </div>
              </div>
              <div>
                <button
                  onClick={() => handleUpdateClick(product.id)}
                  style={{
                    marginRight: '10px',
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#1976d2',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Update
                </button>
                <button
                  onClick={() => handleRemoveClick(product.id)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#d32f2f',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Products
