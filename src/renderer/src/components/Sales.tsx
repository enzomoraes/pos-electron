import { useEffect } from 'react'
import { useSales } from '../hooks/useSales'

const Sales = () => {
  const { sales, fetchSales, printSale } = useSales()

  useEffect(() => {
    fetchSales()
  }, [fetchSales])

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
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Sales History</h1>

      {sales.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#aaa' }}>No sales found.</p>
      ) : (
        <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
          {sales.map((sale) => (
            <li
              key={sale.id}
              style={{
                backgroundColor: '#1e1e1e',
                marginBottom: '20px',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                border: '1px solid #333'
              }}
            >
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Sale #{sale.id}</h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#ccc' }}>
                Date: {sale.createdAt.toLocaleDateString()} - {sale.createdAt.toLocaleTimeString()}
              </p>

              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                {sale.items.map((item, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: '6px', fontSize: '15px', color: '#e0e0e0' }}
                  >
                    •{' '}
                    {item.product.name
                      .split(' ')
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(' ')}{' '}
                    — Quantity: {item.quantity} — R$
                    {item.price.toFixed(2)}
                  </li>
                ))}
              </ul>

              <h3
                style={{
                  marginTop: '10px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#4caf50'
                }}
              >
                Total: R${sale.total.toFixed(2)}
              </h3>
              <button
                onClick={() => printSale(sale.id)}
                style={{
                  backgroundColor: '#4caf50',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  transition: 'background-color 0.3s ease'
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4caf50')}
              >
                Print Sale
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Sales
