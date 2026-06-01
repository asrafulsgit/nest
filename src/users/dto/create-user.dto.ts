import { IsDefined, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({message : "Name should be string"})
  @MinLength(3,{message : "Name field must has 3 characters"})
  @IsNotEmpty({message : "Name is required"}) 
  name!: string;

  @IsEmail()
  @IsNotEmpty({message : "Email is required"}) 
  email!: string;

  @IsString({message : "Password must be string"})
  @IsNotEmpty({message : "Password is required"}) 
  password!: string;
}
