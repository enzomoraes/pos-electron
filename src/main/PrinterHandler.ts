// code adapted from seco35 -> https://github.com/Hubertformin/electron-pos-printer/issues/120
import { exec } from 'child_process'
import fs from 'fs'
import { Sale } from './entities/Sale'

const PRINT_WIDTH = 80 // Width of the receipt in characters
async function escposData(sale: Sale) {
  const maxQtyWidth = 4 // Max width for quantity (e.g., "9999")
  const availableItemWidth = PRINT_WIDTH - maxQtyWidth - 4 // 4 spaces for padding

  // Function to truncate long product names (with sanitization)
  const truncate = (text, maxLength) => {
    let cleanText = sanitizeText(text) // Remove emojis & unwanted characters
    return cleanText.length > maxLength ? cleanText.substring(0, maxLength - 3) + '...' : cleanText
  }

  // Function to format an order line
  const formatLine = (qty: number, name: string): number[] => {
    let qtyStr = (qty.toString() + 'x').padEnd(maxQtyWidth, ' ')
    let nameStr = truncate(name, availableItemWidth).padEnd(availableItemWidth, ' ')

    return [
      ...Buffer.from(`${qtyStr} ${nameStr} `, 'utf-8'),
      0x0a // New line
    ]
  }
  // Function to remove emojis and unwanted characters
  const sanitizeText = (text) => {
    return text
      .replace(/[^\x00-\x7F]/g, '') // Remove non-UTF8 characters
      .trim() // Trim extra spaces
  }

  // Format the date in German style
  const formatDate = (date: Date) => {
    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`
  }
  let lines = [0x1b, 0x40] // Initialize printer

  lines.push(
    0x1b,
    0x74,
    0x10, // Windows Latin
    0x1b,
    0x61,
    0x01, // Center align
    0x1b,
    0x61,
    0x00,
    ...Buffer.from(`Pedido: ${sale.id}`, 'utf-8'),
    0x0a,
    ...Buffer.from(`Data: ${formatDate(sale.createdAt)}`, 'utf-8'),
    0x0a,
    0x0a
  )
  sale.items.forEach((item) => {
    for (let i = 0; i < item.quantity; i++) {
      lines.push(...formatLine(1, item.product.name))
    }
  })
  lines.push(...Buffer.from('Obrigado pela compra!\n', 'utf-8'))

  lines.push(
    0x0a,
    0x0a,
    0x0a,
    0x0a,
    0x0a, // Feed paper
    0x1d,
    0x56,
    0x00, // Cut paper
    0x1b,
    0x40 // Reset printer
  )

  return Buffer.from(lines)
}

class PrintHandler {
  private printQueue: {
    printerName: string
    rawData: Buffer<ArrayBuffer>
    resolve: Function
    reject: Function
  }[]
  private isPrinting: boolean
  constructor() {
    this.printQueue = []
    this.isPrinting = false
  }

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
      resolve() // Resolve the promise when done
    } catch (error) {
      console.error(`Error printing: ${error instanceof Error ? error.message : String(error)}`)
      reject(error)
    } finally {
      this.isPrinting = false
      this.processPrintQueue() // Process the next job
    }
  }

  private queuePrintJob(printerName, rawData) {
    return new Promise((resolve, reject) => {
      this.printQueue.push({ printerName, rawData, resolve, reject })
      this.processPrintQueue()
    })
  }

  private async __printRawData(printerName, rawData) {
    return new Promise((resolve, reject) => {
      const tempFile = `receipt${Date.now()}.bin`
      fs.writeFileSync(tempFile, rawData, 'binary')

      const command =
        process.platform === 'win32'
          ? // ? `copy /B ${tempFile} \\\\localhost\\${printerName} && timeout /t 2 && net stop spooler && net start spooler`
            `copy /B ${tempFile} \\\\localhost\\${printerName}`
          : `cancel -a && lpr -P "${printerName}" -o raw ${tempFile}`

      exec(command, (error, stdout, stderr) => {
        fs.unlinkSync(tempFile)
        if (error) {
          reject(error)
        } else {
          console.log(`Printed successfully: ${stdout || stderr}`)
          setTimeout(resolve, 3000) // Delay 2 seconds before resolving
        }
      })
    })
  }

  async printSale(printerName: string, sale: Sale) {
    console.log('Printing at: ', printerName)
    let escData = await escposData(sale)
    const rawData = Buffer.from(escData)
    await this.queuePrintJob(printerName, rawData)
  }
}

// Singleton instance
const printHandler = new PrintHandler()

export default printHandler
