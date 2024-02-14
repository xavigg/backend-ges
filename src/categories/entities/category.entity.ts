import { BaseEntity } from 'src/config/base.entity';
import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category extends BaseEntity {
  // ID
  @PrimaryGeneratedColumn()
  idcategory: number;

  @Column({ type: 'varchar' })
  name: string;

  // RELATIONS

  // PRODUCT
  @OneToMany(() => Product, (product) => product.category)
  product: Product[];
}
