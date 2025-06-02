import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { Sale } from '../../../main/entities/Sale'

export function useSales(): {
  sales: Sale[]
  fetchSales: (salesDate?: string) => Promise<void>
  printSale: (saleId: number) => Promise<void>
  removeSale: (saleId: number) => Promise<void>
} {
  const [sales, setSales] = useState<Sale[]>([])

  const fetchSales = useCallback(async (salesDate?: string) => {
    try {
      const sales = await window.api.getSales(salesDate)
      setSales(
        sales.map((sale) => ({
          ...sale,
          total: sale.total / 100,
          items: sale.items.map((item) => ({
            ...item,
            price: item.price / 100,
            stock: item.stock / 100
          }))
        }))
      )
    } catch (error) {
      console.error('Error fetching sales:', error)
      toast.error('Error fetching sales')
    }
  }, [])

  const printSale = useCallback(async (saleId: number) => {
    const sale = await window.api.getSale(saleId)
    try {
      await window.api.print(sale)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  const removeSale = useCallback(async (saleId: number) => {
    try {
      await window.api.removeSale(saleId)
      setSales((prev) => prev.filter((sale) => sale.id !== saleId))
      toast.success('Sale removed successfully!')
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  return {
    sales,
    fetchSales,
    printSale,
    removeSale
  }
}
