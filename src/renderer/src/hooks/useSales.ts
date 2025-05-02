import { useCallback, useState } from 'react'
import { Sale } from '../../../main/entities/Sale'
import { toast } from 'react-toastify'

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

  const printSale = useCallback(
    async (saleId: number) => {
      const sale = await window.api.getSale(saleId)
      const items = sale.items.map((item) => ({
        ...item,
        price: item.price / 100,
        stock: item.stock / 100
      }))
      const total = sale.total / 100
      const date = new Date(sale.createdAt)
      const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      const saleData = {
        id: sale.id,
        items,
        total,
        createdAt: formattedDate
      }
      const receipt = `
        Sale ID: ${saleData.id}
        Date: ${saleData.createdAt}
        Items:
        ${saleData.items
          .map(
            (item) =>
              `${item.product.name
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}} - Quantity: ${item.quantity} - Price: R$${item.price.toFixed(2)}`
          )
          .join('\n')}
        Total: R$${saleData.total.toFixed(2)}
      `

      try {
        await window.api.print(sale)
      } catch (error) {
        toast.error((error as Error).message)
      }
    },
    [sales]
  )

  return {
    sales,
    fetchSales,
    printSale
  }
}
