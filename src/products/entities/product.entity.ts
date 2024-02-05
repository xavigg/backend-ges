import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column({ type: 'int4',})
    idcategory: number;
}