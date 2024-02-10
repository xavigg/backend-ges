import { Product } from 'src/products/entities/product.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity({ name: 'brands' })
export class Brand {
  // ID
  @PrimaryGeneratedColumn()
  idbrand: number;

  @Column({ type: 'varchar' })
  name: string;

  // CREATE DATE - UPDATE DATE - DETELED DATE
  @CreateDateColumn({ name: 'created_at' })
  created_at: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: string;

  // RELATIONS

  // PRODUCT
  @OneToMany(() => Product, (product) => product.brand)
  product: Product[];
}
