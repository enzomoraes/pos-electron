import { useCallback, useState } from 'react'
import { toast } from 'react-toastify'
import { Sale } from '../../../main/entities/Sale'

export function useSales(): {
  sales: Sale[]
  fetchSales: () => Promise<void>
  printSale: (saleId: number) => Promise<void>
} {
  const [sales, setSales] = useState<Sale[]>([])

  const fetchSales = useCallback(async () => {
    const sales = await window.api.getSales()
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
  }, [])

  const printSale = useCallback(async (saleId: number) => {
    const sale = await window.api.getSale(saleId)
    try {
      await window.api.print(sale)
    } catch (error) {
      toast.error((error as Error).message)
    }
  }, [])

  return {
    sales,
    fetchSales,
    printSale
  }
}
