import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product {
  // ID
  @PrimaryGeneratedColumn()
  idproduct: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'text' })s
  details: string;

  @Column({ type: 'numeric' })
  warranty: number;

  @Column({ type: 'varchar' })
  img_url: string;

  // CREATE DATE - UPDATE DATE - DETELED DATE
  @CreateDateColumn({ name: 'created_at' })
  created_at: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: string;

  // RELATIONS

  // CATEGORY
  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn({ name: 'idcategory' })
  category: Category;

  // BRAND
  @ManyToOne(() => Brand, (brand) => brand.product)
  @JoinColumn({ name: 'idbrand' })
  brand: Brand;
}
