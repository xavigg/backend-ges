import { Category } from 'src/categories/entities/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToMany, JoinColumn } from 'typeorm';

@Entity({name: 'products'})
export class Product {
    @PrimaryGeneratedColumn()
    idproduct: number;

    @Column({ type: 'varchar',})
    name: string;

    @Column({ type: 'numeric',})
    price: number;

    @Column({ type: 'text',})
    details: string;

    @Column({ type: 'numeric',})
    warranty: number;

    @Column({ type: 'varchar',})
    img_url: string;

    @Column({ type: 'int4',})
    idbrand: number;

    @OneToMany(() => Category, (Category) => Category.idcategory, { cascade: true })
    @JoinColumn({ name: 'name' })
    categoryName: Category;

    @CreateDateColumn({ name: 'created_at' })
    created_at: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deleted_at: string;
}