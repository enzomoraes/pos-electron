import React from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import CreateProduct from './components/CreateProduct'
import Dashboard from './components/Dashboard'
import Navbar from './components/Navbar'
import PointOfSale from './components/PointOfSale'
import Products from './components/Products'
import Sales from './components/Sales'
import UpdateProduct from './components/UpdateProduct'
import { SaleProvider } from './providers/SaleProvider'
import './scrollbar.css' // import if you use separate file

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
            <SaleProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/pos" element={<PointOfSale />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<UpdateProduct />} />
                <Route path="/products/create" element={<CreateProduct />} />
                <Route path="*" element={<Dashboard />} />
              </Routes>
            </SaleProvider>
          </div>
        </div>
      </HashRouter>
    </>
  )
}
export default App
