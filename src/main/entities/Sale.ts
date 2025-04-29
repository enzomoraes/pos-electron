import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm'
import { SaleItem } from './SaleItem';

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => SaleItem, saleItem => saleItem.sale, { cascade: true })
  items!: SaleItem[];

  @Column("decimal", { precision: 10, scale: 2 })
  total!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
