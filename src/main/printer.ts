import { webContents } from 'electron'
import printHandler from './PrinterHandler'
import { Sale } from './entities/Sale'

let defaultPrinter = ''
async function getDefaultPrinter(): Promise<string> {
  if (defaultPrinter) return defaultPrinter
  const printers = await webContents.getFocusedWebContents()?.getPrintersAsync()
  defaultPrinter = printers?.find((printer) => printer.isDefault)?.name ?? 'default'
  return defaultPrinter
}

export async function print(sale: Sale) {
  const printerName = await getDefaultPrinter()
  await printHandler.printSale(printerName, sale)
}
