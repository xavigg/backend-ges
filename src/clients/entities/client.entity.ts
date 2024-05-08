import { BaseEntity } from 'src/config/base.entity';
import { FiscalCondition } from 'src/fiscal-condition/entities/fiscal-condition.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'clients' })
export class Client extends BaseEntity {
  @Column({ primary: true, generated: true })
  clientId: number;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500 })
  lastName: string;

  @Column({ length: 500 })
  adress: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: 0 })
  phoneNumber: string;

  @Column({ default: 0 })
  docNumber: string;

  @Column({ default: 0 })
  cuit: string;

  @Column({ default: 1 })
  fiscalConditionId: number;

  /* RELATIONS */

  // FISCAL CONDITION
  @ManyToOne(() => FiscalCondition, (fiscalCondition) => fiscalCondition)
  @JoinColumn({ name: 'fiscalConditionId' })
  fiscalCondition: FiscalCondition;

}
