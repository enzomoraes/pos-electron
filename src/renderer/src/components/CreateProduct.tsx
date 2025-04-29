import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'

const CreateProduct = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      price: 0,
      stock: 0
    }
  })

  const onSubmit = (data: { name: string; price: number; stock: number }) => {
    const newProduct = {
      name: data.name,
      price: data.price * 100,
      stock: data.stock * 100
    }

    window.api.createProduct(newProduct).then(() => {
      toast.success('Product created successfully!')
      reset() // Reset the form fields
      navigate('/products')
    })
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Name:
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              style={{ marginLeft: '10px' }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Price:
            <input
              type="number"
              step=".01"
              {...register('price', {
                required: 'Price is required',
                min: { value: 0.01, message: 'Price must be greater than 0' }
              })}
            />
          </label>
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>
            Stock:
            <input type="number" step=".5" {...register('stock', { required: true, min: 0 })} />
          </label>
        </div>
        <button
          type="submit"
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#4caf50',
            color: '#fff'
          }}
        >
          Create Product
        </button>
      </form>
    </div>
  )
}

export default CreateProduct
