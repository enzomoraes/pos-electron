import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useProducts } from '../hooks/useProducts'

const CreateProduct = () => {
  const navigate = useNavigate()
  const { createProduct } = useProducts()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      price: 0,
      stock: 0
    }
  })

  const onSubmit = async (data: { name: string; price: number; stock: number }) => {
    await createProduct(data)
    toast.success('Product created successfully!')
    navigate('/products')
  }

  return (
    <div
      style={{
        padding: '40px 20px',
        maxWidth: '500px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        color: '#f1f1f1',
        borderRadius: '8px'
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Create Product</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Name:
          </label>
          <input
            type="text"
            {...register('name', { required: 'Name is required' })}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #444',
              backgroundColor: '#1e1e1e',
              color: '#f1f1f1'
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Price:
          </label>
          <input
            type="number"
            step=".01"
            {...register('price', {
              required: 'Price is required',
              min: { value: 0.01, message: 'Price must be greater than 0' }
            })}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #444',
              backgroundColor: '#1e1e1e',
              color: '#f1f1f1'
            }}
          />
        </div>

        <div style={{ marginBottom: '30px' }}>
          <label
            style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 'bold',
              fontSize: '14px'
            }}
          >
            Stock:
          </label>
          <input
            type="number"
            step=".5"
            {...register('stock', { required: true, min: 0 })}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              borderRadius: '5px',
              border: '1px solid #444',
              backgroundColor: '#1e1e1e',
              color: '#f1f1f1'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#4caf50',
            color: '#fff',
            transition: 'background 0.3s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#43a047')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4caf50')}
        >
          Create Product
        </button>
      </form>
    </div>
  )
}

export default CreateProduct
