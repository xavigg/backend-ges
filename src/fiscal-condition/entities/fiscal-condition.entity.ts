import { Client } from 'src/clients/entities/client.entity';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { billTypeEnum, fiscalConditionEnum } from '../enum/fiscal-condition.enum';
import { BaseEntity } from 'src/config/base.entity';

@Entity({ name: 'fiscal-condition' })
export class FiscalCondition extends BaseEntity {
  @Column({ primary: true, generated: true })
  fiscalConditionId: number;

  @Column({ type: 'enum', enum: fiscalConditionEnum })
  condition: string;

  @Column({ type: 'enum', enum: billTypeEnum })
  billType: string;

  /* RELATIONS */

  // CLIENT
  @OneToMany(() => Client, (client) => client.fiscalCondition)
  client: Client[];
}
