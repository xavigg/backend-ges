import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { FiscalConditionModule } from './fiscal-condition/fiscal-condition.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }), 
    DbModule,
    ProductsModule,
    BrandsModule,
    CategoriesModule,
    FileUploadModule,
    UsersModule,
    AuthModule,
    ClientsModule,
    FiscalConditionModule
  ],
})
export class AppModule  {}