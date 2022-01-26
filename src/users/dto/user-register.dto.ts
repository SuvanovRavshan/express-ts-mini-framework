import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserRegisterDto
{
	@IsEmail({}, { message: 'Wrong email' })
	email: string;

	@IsString()
	@MinLength(6)
	@MaxLength(16)
	password: string;

	@IsString()
	@MinLength(3)
	@MaxLength(20)
	name: string;
}
