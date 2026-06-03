import { PartialType } from '@nestjs/mapped-types'; 
import { SingupDto } from '../../auth/dto/signup.dto';

export class UpdateUserDto extends PartialType(SingupDto) {}
