import { Link } from 'react-router-dom';

const Navbar = () => {
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
      }}
    >
      <Link
        to="/pos"
        style={{
          marginRight: '15px',
          textDecoration: 'none',
          color: '#4CAF50', // Modern green color
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Point of Sale
      </Link>
      <Link
        to="/products"
        style={{  
          marginRight: '15px',
          textDecoration: 'none',
          color: '#4CAF50',
          fontWeight: 'bold',
          fontSize: '16px',
        }}
      >
        Products
      </Link>
    </nav>
  );
};

export default Navbar;