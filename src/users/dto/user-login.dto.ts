import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UserLoginDto
{
	@IsEmail({}, { message: 'Wrong email' })
	email: string;

	@IsString()
	@MinLength(6)
	@MaxLength(16)
	password: string;
}
