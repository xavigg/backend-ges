import { Brand } from 'src/brands/entities/brand.entity';
import { Category } from 'src/categories/entities/category.entity';
import { BaseEntity } from 'src/config/base.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product extends BaseEntity {
  // ID
  @PrimaryGeneratedColumn()
  productId: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'numeric' })
  price: number;

  @Column({ type: 'text' })
  details: string;

  @Column({ type: 'numeric' })
  warranty: number;

  @Column({ type: 'varchar' })
  img_url: string;

  @Column({ type: 'numeric' })
  categoryId: number;

  @Column({ type: 'numeric' })
  brandId: number;


  // RELATIONS

  // CATEGORY
  @ManyToOne(() => Category, (category) => category.product)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  // BRAND
  @ManyToOne(() => Brand, (brand) => brand.product)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;
}
