import { HttpStatus, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { ErrorHandler } from 'src/shared/error.handler';

@Injectable()
export class FileUploadService {
  private readonly s3: S3Client;

  constructor(private configService: ConfigService) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
    });
  }

  async uploadFile(
    folderName: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const uploadParams = {
      Bucket: bucketName,
      Key: `${folderName}/${uuidv4()}-${file.originalname}`,
      Body: file.buffer,
    };
    try {
      const command = new PutObjectCommand(uploadParams);
      const data: PutObjectCommandOutput = await this.s3.send(command);
      return 'File uploaded successfully';
    } catch (error) {
      ErrorHandler.createSignatureError({
        message: error.message,
        statusCode: HttpStatus.BAD_REQUEST,
      });
    }
  }
}
