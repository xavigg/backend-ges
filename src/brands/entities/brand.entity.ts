import { BaseEntity } from 'src/config/base.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'brands' })
export class Brand extends BaseEntity {
  // ID
  @PrimaryGeneratedColumn()
  idbrand: number;

  @Column({ type: 'varchar' })
  name: string;

  // RELATIONS

  // PRODUCT
  @OneToMany(() => Product, (product) => product.brand)
  product: Product[];
}
