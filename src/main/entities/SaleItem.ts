import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from './Product';
import { Sale } from './Sale';

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Sale, sale => sale.items)
  sale!: Sale;

  @ManyToOne(() => Product)
  product!: Product;

  @Column({ type: 'int' })
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  totalPrice!: number;
}
