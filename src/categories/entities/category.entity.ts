import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn()
    idcategory: number;

    @Column({ type: 'varchar',})
    name: string;

}