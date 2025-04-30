import { USB, Printer } from 'escpos'

export async function print(message: string) {
  const device = new USB().open()
  await new Promise<void>((resolve, reject) => {
    device.open(async function (err) {
      if (err) {
        reject(err)
        return
      }
      const options = { encoding: 'GB18030' /* default */ }

      const printer = new Printer(device, options)

      printer.font('A').align('CT').style('BU').size(1, 1).text(message)

      printer.cut().close(() => resolve)
    })
  })
}
