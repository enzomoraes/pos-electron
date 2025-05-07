import { SaleInfo } from '@renderer/contexts/SaleContext'
import { useCart } from '@renderer/hooks/useCart'
import { FC, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

interface CloseSaleProps {
  onClose: () => void
  onConfirm: () => void
}

export const CloseSale: FC<CloseSaleProps> = ({ onClose, onConfirm }) => {
  const { closeSale } = useCart()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<SaleInfo>({
    defaultValues: { clientName: '', paymentMethod: 'pix' }
  })

  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscapeKey)
    return () => {
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [onClose])

  const handleFormSubmit: SubmitHandler<SaleInfo> = (data) => {
    closeSale(data)
    reset()
    onConfirm()
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      style={{
        backgroundColor: '#1e1e1e',
        color: '#f1f1f1',
        padding: '24px',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.7)',
        maxWidth: '400px',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      <h2 style={{ marginBottom: '20px', fontSize: '24px', textAlign: 'center' }}>
        Finalizar Venda
      </h2>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="clientName" style={{ display: 'block', marginBottom: '6px' }}>
          Nome do Cliente:
        </label>
        <input
          autoFocus
          id="clientName"
          {...register('clientName')}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #444',
            backgroundColor: '#2c2c2c',
            color: '#f1f1f1'
          }}
        />
        {errors.clientName && (
          <p style={{ color: '#f44336', fontSize: '12px', marginTop: '4px' }}>
            {errors.clientName.message}
          </p>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label htmlFor="paymentMethod" style={{ display: 'block', marginBottom: '6px' }}>
          Forma de Pagamento:
        </label>
        <select
          id="paymentMethod"
          {...register('paymentMethod', { required: true })}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #444',
            backgroundColor: '#2c2c2c',
            color: '#f1f1f1'
          }}
        >
          <option value="pix">PIX</option>
          <option value="dinheiro">Dinheiro</option>
          <option value="cartão">Cartão</option>
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            backgroundColor: '#444',
            color: '#f1f1f1',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Cancelar
        </button>
        <button
          type="submit"
          style={{
            backgroundColor: '#4caf50',
            color: '#fff',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Confirmar
        </button>
      </div>
    </form>
  )
}
