import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [appVersion, setAppVersion] = useState('')

  useEffect(() => {
    const getVersion = async () => {
      const appVersion = await window.api.getVersion()
      setAppVersion(appVersion)
    }
    getVersion()
  }, [])

  return (
    <nav
      style={{
        padding: '10px 20px',
        backgroundColor: 'rgba(255, 255, 255, 0)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        alignItems: 'center',
        borderRadius: '8px',
        justifyContent: 'space-between'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Link
          to="/home"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#4CAF50',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Home
        </Link>
        <Link
          to="/pos"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#4CAF50', // Modern green color
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          POS
        </Link>
        <Link
          to="/products"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#4CAF50',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Products
        </Link>
        <Link
          to="/sales"
          style={{
            marginRight: '15px',
            textDecoration: 'none',
            color: '#4CAF50',
            fontWeight: 'bold',
            fontSize: '16px'
          }}
        >
          Sales
        </Link>
      </div>
      <span
        style={{
          color: '#888',
          fontSize: '14px',
          fontWeight: 'bold',
          letterSpacing: '1px'
        }}
      >
        v{appVersion}
      </span>
    </nav>
  )
}

export default Navbar
