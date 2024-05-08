import { Module } from '@nestjs/common';
import { FiscalConditionService } from './fiscal-condition.service';
import { FiscalConditionController } from './fiscal-condition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FiscalCondition } from './entities/fiscal-condition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FiscalCondition])],
  controllers: [FiscalConditionController],
  providers: [FiscalConditionService],
})
export class FiscalConditionModule {}
