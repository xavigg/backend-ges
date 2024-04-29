import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class SanitizeTextPipe implements PipeTransform {
  transform(value: any) {
    const remplace = value.replace(/[^a-zA-Z0-9 ]/g, "");  
    return  remplace;
  }
}
