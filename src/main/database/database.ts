import { DataSource } from 'typeorm';
import { Product } from '../entities/Product';
import sqlite3 from 'sqlite3';
export const AppDataSource = new DataSource({
  type: 'sqlite',
  driver: sqlite3,
  database: './database.sqlite',
  synchronize: true, // Automatically syncs the database schema (use only in development)
  entities: [Product],
  entitySkipConstructor: true
});