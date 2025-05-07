import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { Product } from './Product'
import { Sale } from './Sale'

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number

  @ManyToOne(() => Sale, (sale) => sale.items, { onDelete: 'CASCADE' })
  sale!: Sale

  @ManyToOne(() => Product)
  product!: Product

  @Column('int')
  quantity!: number

  @Column('int')
  price!: number

  @Column('int')
  totalPrice!: number
}
