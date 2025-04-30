import { useCallback, useState } from 'react'
import { Sale } from '../../../main/entities/Sale'

export function useSales() {
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

  return {
    sales,
    fetchSales
  }
}
