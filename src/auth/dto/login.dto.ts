import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({message : "Email is required"}) 
  email!: string;

  @IsString({message : "Password must be string"})
  @IsNotEmpty({message : "Password is required"}) 
  @MinLength(6,{message : "Password must be 6 characters"})
  password!: string;
}
