import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'brands'})
export class Brand {
    @PrimaryGeneratedColumn()
    idbrand: number;

    @Column({ type: 'varchar',})
    name: string;

}