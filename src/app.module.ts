import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { ConfigModule } from '@nestjs/config';
import { DbModule } from './db.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { FileUploadModule } from './file-upload/file-upload.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }), 
    DbModule,
    ProductsModule,
    BrandsModule,
    CategoriesModule,
    FileUploadModule
  ],
})
export class AppModule {}
