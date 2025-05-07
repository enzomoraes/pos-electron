import sqlite3 from 'better-sqlite3'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { DataSource } from 'typeorm'
import { Product } from '../entities/Product'
import { Sale } from '../entities/Sale'
import { SaleItem } from '../entities/SaleItem'

import { app } from 'electron'
const APP_NAME = app.getName()
const DB_FILENAME = 'database.sqlite'

function getDatabasePath(): string {
  const dbDir = (() => {
    switch (process.platform) {
      case 'win32':
        return path.join(
          process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'),
          APP_NAME
        )
      case 'darwin':
        return path.join(os.homedir(), 'Library', 'Application Support', APP_NAME)
      default:
        return path.join(os.homedir(), `.${APP_NAME}`)
    }
  })()

  // Ensure directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  return path.join(dbDir, DB_FILENAME)
}

export const AppDataSource = new DataSource({
  type: 'better-sqlite3',
  driver: sqlite3,
  database: getDatabasePath(),
  synchronize: true, // Automatically syncs the database schema (use only in development)
  entities: [Product, Sale, SaleItem],
  entitySkipConstructor: true
})
