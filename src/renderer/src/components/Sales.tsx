import { useEffect, useState } from 'react'

const Sales = () => {
  const [sales, setSales] = useState<
    {
      id: number
      items: { name: string; quantity: number; price: number }[]
      total: number
      date: string
    }[]
  >([])

  useEffect(() => {
    window.api.getSales().then((fetchedSales) => {
      setSales(fetchedSales)
    })
  }, [])

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
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              <h2 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Sale #{sale.id}</h2>
              <p style={{ margin: '0 0 16px 0', fontSize: '14px', color: '#ccc' }}>
                Date: {new Date(sale.date).toLocaleString()}
              </p>

              <ul style={{ paddingLeft: '20px', marginBottom: '16px' }}>
                {sale.items.map((item, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: '6px', fontSize: '15px', color: '#e0e0e0' }}
                  >
                    • {item.name} — Quantity: {item.quantity} — R$
                    {(item.price / 100).toFixed(2)}
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
                Total: R${(sale.total / 100).toFixed(2)}
              </h3>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Sales
