import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Products = () => {
  const navigate = useNavigate()
  const [products, setProducts] = useState(
    [] as {
      id: number
      name: string
      price: number
      stock: number
    }[]
  )

  useEffect(() => {
    window.api.getProducts().then((products) => {
      setProducts(products)
    })
  })

  const handleUpdateClick = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  const handleRemoveClick = (productId: number) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      window.api.removeProduct(productId).then(() => {
        setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId))
        toast.success('Product removed successfully!')
      })
    }
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>Products</h1>

      <button style={{ marginBottom: '20px' }} onClick={() => navigate('/products/create')}>
        Create Product
      </button>

      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {products.map((product) => (
          <li key={product.id} style={{ marginBottom: '10px' }}>
            <span style={{ marginRight: '10px' }}>
              {product.name} - R${(product.price / 100).toFixed(2)} - #{product.stock}
            </span>
            <button onClick={ () => handleUpdateClick(product.id) }>Update Product</button>
            <button onClick={ () => handleRemoveClick(product.id) }>Remove Product</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Products
