import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileUploadController } from './file-upload.controller';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, ConfigService],
})
export class FileUploadModule {}
