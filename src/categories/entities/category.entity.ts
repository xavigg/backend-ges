import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity({name: 'categories'})
export class Category {
    @PrimaryGeneratedColumn()
    idcategory: number;

    @Column({ type: 'varchar',})
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    created_at: string;

    @UpdateDateColumn({ name: 'updated_at' })
    updated_at: string;

    @DeleteDateColumn({ name: 'deleted_at' })
    deleted_at: string;

}