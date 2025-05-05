import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { AppDataSource } from './database/database'
import { print } from './printer'
import { Sale } from './entities/Sale'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

ipcMain.handle('get-products', async () => {
  const productRepo = AppDataSource.getRepository('Product')
  const products = await productRepo.find()
  return products
})

ipcMain.handle('create-product', async (_, productData) => {
  console.log('Create product data:', productData)
  const productRepo = AppDataSource.getRepository('Product')
  const newProduct = productRepo.create(productData)
  const savedProduct = await productRepo.save(newProduct)
  return savedProduct
})

ipcMain.handle('remove-product', async (_, productId) => {
  const productRepo = AppDataSource.getRepository('Product')
  await productRepo.delete({ id: productId })
})

ipcMain.handle('get-product', async (_, productId) => {
  const productRepo = AppDataSource.getRepository('Product')
  const product = await productRepo.findOneBy({ id: productId })
  return product
})

ipcMain.handle('update-product', async (_, id, productData) => {
  const productRepo = AppDataSource.getRepository('Product')
  const product = await productRepo.findOneBy({ id })
  if (!product) {
    throw new Error('Product not found')
  }
  product.name = productData.name
  product.price = productData.price
  product.stock = productData.stock
  await productRepo.save(product)
  return product
})

ipcMain.handle(
  'sell',
  async (
    _,
    saleData: {
      items: { productId: number; quantity: number; price: number }[]
      info: { clientName: string; paymentMethod: string }
    }
  ) => {
    const saleRepo = AppDataSource.getRepository('Sale')
    const saleItemRepo = AppDataSource.getRepository('SaleItem')
    const productRepo = AppDataSource.getRepository('Product')
    console.log('Sale data:', saleData)
    const total = saleData.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    // Create a new sale
    const newSale = saleRepo.create({
      total,
      clientName: saleData.info.clientName,
      paymentMethod: saleData.info.paymentMethod
    })
    const savedSale = await saleRepo.save(newSale)

    // Create sale items
    for (const item of saleData.items) {
      const quantityToDecrease = item.quantity * 100
      const product = await productRepo.findOneBy({ id: item.productId })
      if (!product) {
        throw new Error(`Product with ID ${item.productId} not found`)
      }
      if (product.stock < quantityToDecrease) {
        throw new Error(`Not enough stock for product ${product.name}`)
      }
      product.stock -= quantityToDecrease
      await productRepo.save(product)

      const saleItem = saleItemRepo.create({
        ...item,
        totalPrice: item.price * item.quantity,
        sale: savedSale,
        product
      })
      await saleItemRepo.save(saleItem)
    }

    return savedSale
  }
)

ipcMain.handle('get-sales', async () => {
  const saleRepo = AppDataSource.getRepository('Sale')
  const sales = await saleRepo.find({
    relations: {
      items: {
        product: true
      }
    },
    order: {
      createdAt: 'DESC'
    }
  })

  return sales
})

ipcMain.handle('get-sale', async (_, id: number) => {
  const saleRepo = AppDataSource.getRepository('Sale')
  const sale = await saleRepo.findOne({
    where: { id },
    relations: {
      items: {
        product: true
      }
    },
    order: {
      createdAt: 'DESC'
    }
  })

  return sale
})

ipcMain.handle('print', async (_, sale: Sale) => {
  await print(sale)
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Initialize the database
  await AppDataSource.initialize()

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
