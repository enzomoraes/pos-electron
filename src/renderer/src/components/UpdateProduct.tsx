import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const UpdateProduct = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      price: 0,
      stock: 0
    }
  })

  useEffect(() => {
    async function fetchProduct() {
      try {
        const product = await window.api.getProduct(parseInt(id!))
        reset({ name: product.name, price: product.price / 100, stock: product.stock })
      } catch (error) {
        console.error('Failed to fetch product', error)
        toast.error('Error fetching product!')
        navigate('/products')
      }
    }

    fetchProduct()
  }, [id, reset, navigate])

  const onSubmit = (data: { name: string; price: number; stock: number }) => {
    const updatedProduct = {
      name: data.name,
      price: data.price * 100,
      stock: data.stock
    }

    window.api.updateProduct(parseInt(id!), updatedProduct).then(() => {
      toast.success('Product updated successfully!')
      navigate('/products')
    })
  }

  return (
    <div>
      <h1>Update Product</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>
            Name:
            <input type="text" {...register('name', { required: true })} />
          </label>
        </div>
        <div>
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
        <div>
          <label>
            Stock:
            <input type="number" {...register('stock', { required: true, min: 0 })} />
          </label>
        </div>
        <button type="submit" style={{ marginTop: '10px' }}>
          Update Product
        </button>
      </form>
    </div>
  )
}

export default UpdateProduct
