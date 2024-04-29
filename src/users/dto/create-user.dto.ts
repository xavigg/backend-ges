import { Transform } from "class-transformer";
import { IsEmail,  IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { BaseEntity } from "src/config/base.entity";
import { ROLES } from "src/constants/roles";

export class CreateUserDto /*extends BaseEntity */ {
  
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(500)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  lastname: string;

  @IsString()
  @MaxLength(500)
  adress: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Transform(({ value }) => value.trim())
  password: string;

/*
  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;*/


  }