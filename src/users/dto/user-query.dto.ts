import { IsEmail, IsOptional, IsString } from 'class-validator';
import { BaseQueryDto } from '../../common/dto/base-query.dto';

export class UserQueryDto extends BaseQueryDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
