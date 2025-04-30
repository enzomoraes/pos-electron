import { useEffect, useState } from 'react'
import { useSales } from '../hooks/useSales'

const Dashboard = () => {
  const { sales, fetchSales } = useSales()
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  useEffect(() => {
    fetchSales()
  }, [])

  const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0)
  const totalProductsSold = sales.reduce(
    (acc, sale) => acc + sale.items.reduce((sum, item) => sum + item.quantity, 0),
    0
  )
  const lastSaleDate = sales.length
    ? new Date(
        Math.max(...sales.map((sale) => new Date(sale.createdAt).getTime()))
      ).toLocaleString()
    : 'N/A'

  // calcula totais vendidos por produto
  const productCounts = sales
    .flatMap((sale) =>
      sale.items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          name: item.product.name
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ')
        }
      }))
    )
    .reduce(
      (acc, item) => {
        acc[item.product.name] = (acc[item.product.name] || 0) + item.quantity
        return acc
      },
      {} as Record<string, number>
    )

  const topItems = Object.entries(productCounts)
    .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
    .slice(0, 3)

  const averageTicket = sales.length ? totalRevenue / sales.length : 0
  const averageItemsPerSale = sales.length ? totalProductsSold / sales.length : 0

  const metricCards = [
    { title: 'Total Sales', value: sales.length },
    { title: 'Total Revenue', value: `R$${totalRevenue.toFixed(2)}` },
    { title: 'Products Sold', value: totalProductsSold },
    { title: 'Average Ticket', value: `R$${averageTicket.toFixed(2)}` },
    { title: 'Average Items/Sale', value: averageItemsPerSale.toFixed(2) },
    { title: 'Last Sale', value: lastSaleDate, fontSize: '16px' }
  ]

  return (
    <div
      style={{
        color: '#f1f1f1',
        minHeight: '100vh',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          marginBottom: '40px',
          fontSize: '32px',
          fontWeight: 'bold'
        }}
      >
        Dashboard
      </h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}
      >
        {metricCards.map((card, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredMetric(idx)}
            onMouseLeave={() => setHoveredMetric(null)}
            style={{
              backgroundColor: '#1e1e1e',
              padding: '24px',
              borderRadius: '10px',
              border: '1px solid #333',
              boxShadow:
                hoveredMetric === idx
                  ? '0 8px 16px rgba(0, 0, 0, 0.8)'
                  : '0 2px 8px rgba(0, 0, 0, 0.7)',
              transform: hoveredMetric === idx ? 'translateY(-5px) scale(1.02)' : 'none',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              textAlign: 'center'
            }}
          >
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#ccc' }}>{card.title}</h3>
            <p
              style={{
                margin: 0,
                fontSize: card.fontSize ?? '28px',
                fontWeight: 'bold',
                color: '#4caf50'
              }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Top 3 Sold Items */}
      <div style={{ marginTop: '40px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#f1f1f1' }}>
          Top 3 Sold Items
        </h2>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {topItems.map(([name, qty], idx) => (
            <li
              key={name}
              onMouseEnter={() => setHoveredItem(idx)}
              onMouseLeave={() => setHoveredItem(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '10px',
                alignItems: 'center',
                backgroundColor: '#1e1e1e',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #333',
                boxShadow:
                  hoveredItem === idx ? '0 6px 12px rgba(0,0,0,0.8)' : '0 2px 6px rgba(0,0,0,0.7)',
                transform: hoveredItem === idx ? 'scale(1.02)' : 'none',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                marginBottom: '12px'
              }}
            >
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#4caf50',
                  width: '32px',
                  textAlign: 'center'
                }}
              >
                #{idx + 1}
              </span>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f1f1f1' }}>{name}</div>
                <div style={{ fontSize: '14px', color: '#ccc' }}>Quantidade vendida: {qty}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Dashboard
