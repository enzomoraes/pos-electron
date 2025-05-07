// code adapted from seco35 -> https://github.com/Hubertformin/electron-pos-printer/issues/120
import { exec } from 'child_process'
import fs from 'fs'
import { Sale } from './entities/Sale'
import { SaleItem } from './entities/SaleItem'

const PRINT_WIDTH = 80 // Width of the receipt in characters

// ---------------------------
// ESC/POS Receipt Generation
// ---------------------------

/**
 * Generates ESC/POS byte data for a receipt, optionally filtered to a subset of items.
 */
async function escposData(sale: Sale, items: SaleItem[] = sale.items): Promise<Buffer> {
  const maxQtyWidth = 4
  const availableItemWidth = PRINT_WIDTH - maxQtyWidth - 4

  const sanitizeText = (text: string): string => {
    return text
      .replace(/\x00/g, '') // Remove null bytes
      .replace(/\x01/g, '') // Remove start of heading
      .replace(/[^\x20-\xFF]/g, '') // Allow standard + extended ASCII
      .trim()
  }

  const truncate = (text: string, maxLength: number): string => {
    const cleanText = sanitizeText(text)
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength - 3) + '...' : cleanText
  }

  const formatLine = (qty: number, name: string): number[] => {
    const qtyStr = qty.toString() + 'x'
    const nameStr = truncate(name, availableItemWidth)
    return [...Buffer.from(`${qtyStr} ${nameStr} `, 'utf-8'), 0x0a]
  }

  const formatDate = (date: Date): string => {
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
  }

  const lines: number[] = [0x1b, 0x40] // Initialize printer

  // Header
  lines.push(
    0x1d,
    0xf9,
    0x37,
    0x08,
    0x1b,
    0x61,
    0x01, // Center align
    0x1b,
    0x61,
    0x00
  )
  // bold and bigger
  lines.push(
    0x1b,
    0x45,
    0x01, // bold
    0x1b,
    0x21,
    0x10 // double height
  )
  lines.push(...Buffer.from(`Pedido: ${sale.id}`, 'utf-8'), 0x1b, 0x21, 0x00)
  lines.push(0x0a, ...Buffer.from(`Data: ${formatDate(sale.createdAt)}`, 'utf-8'), 0x0a)
  lines.push(0x0a, ...Buffer.from(`Cliente: ${sale.clientName}`, 'utf-8'), 0x0a)
  lines.push(0x0a, ...Buffer.from(`Forma de Pagamento: ${sale.paymentMethod}`, 'utf-8'), 0x0a)

  lines.push(
    0x1b,
    0x45,
    0x01, // bold
    0x1b,
    0x21,
    0x10 // double height
  )

  // Items
  items.forEach((item) => {
    lines.push(...formatLine(item.quantity, item.product.name))
  })
  lines.push(0x0a)
  lines.push(0x1b, 0x21, 0x00) // reset font
  // Footer
  lines.push(...Buffer.from('Obrigado pela compra!\n', 'utf-8'))
  lines.push(0x1b, 0x64, 0x03, 0x1d, 0x56, 0x42, 0x00)

  return Buffer.from(lines)
}

// ---------------------------
// Print Handler
// ---------------------------

class PrintHandler {
  private printQueue: {
    printerName: string
    rawData: Buffer
    resolve: () => void
    reject: (err: unknown) => void
  }[] = []
  private isPrinting: boolean = false

  async processPrintQueue() {
    if (this.isPrinting || this.printQueue.length === 0) return
    this.isPrinting = true

    const next = this.printQueue.shift()
    if (!next) {
      this.isPrinting = false
      return
    }

    const { printerName, rawData, resolve, reject } = next

    try {
      await this.__printRawData(printerName, rawData)
      resolve()
    } catch (error) {
      console.error(`Error printing: ${error instanceof Error ? error.message : String(error)}`)
      reject(error)
    } finally {
      this.isPrinting = false
      this.processPrintQueue()
    }
  }

  private queuePrintJob(printerName: string, rawData: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      this.printQueue.push({ printerName, rawData, resolve, reject })
      this.processPrintQueue()
    })
  }

  private __printRawData(printerName: string, rawData: Buffer): Promise<void> {
    return new Promise((resolve, reject) => {
      const tempFile = `receipt${Date.now()}.bin`
      fs.writeFileSync(tempFile, rawData, 'binary')

      // Escape printer name for command line
      const escapedPrinterName =
        process.platform === 'win32'
          ? printerName.replace(/"/g, '\\"') // Escape quotes for Windows
          : printerName.replace(/"/g, '\\"').replace(/ /g, '\\ ') // Escape spaces and quotes for Linux

      const command =
        process.platform === 'win32'
          ? `copy /B ${tempFile} "\\\\localhost\\${escapedPrinterName}"`
          : `lpr -P "${escapedPrinterName}" -o raw ${tempFile}`

      exec(command, (error) => {
        fs.unlinkSync(tempFile)
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      })
    })
  }

  async printSale(printerName: string, sale: Sale): Promise<void> {
    for (const item of sale.items) {
      const receiptData = await escposData(sale, [item])
      await this.queuePrintJob(printerName, receiptData)
    }
  }
}

// Singleton instance
const printHandler = new PrintHandler()

export default printHandler
