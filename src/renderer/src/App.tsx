import { HashRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Products from './components/Products'
import PointOfSale from './components/PointOfSale'
import UpdateProduct from './components/UpdateProduct'
import CreateProduct from './components/CreateProduct'
import { ToastContainer } from 'react-toastify'
import './scrollbar.css' // import if you use separate file
import Sales from './components/Sales'
import Dashboard from './components/Dashboard'

function App(): React.JSX.Element {
  return (
    <>
      <HashRouter>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
          <div style={{ flexShrink: 0 }}>
            <Navbar />
          </div>
          <div
            className="scroll-container"
            style={{ flexGrow: 1, padding: '16px', overflow: 'auto' }}
          >
            <ToastContainer />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/pos" element={<PointOfSale />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<UpdateProduct />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="*" element={<Dashboard />} />
            </Routes>
          </div>
        </div>
      </HashRouter>
    </>
  )
}
export default App
