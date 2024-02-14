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
  idproduct: number;

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
  idcategory: number;

  @Column({ type: 'numeric' })
  idbrand: number;


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
