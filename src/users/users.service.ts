import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './repository/users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements IUsersService{
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService,
							@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository) {
	}
	async createUser({ email, name, password }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get<number>('salt');
		await newUser.setPassword(password, salt);
		const existedUser = await this.usersRepository.find(email);
		if (existedUser)
			return null;
		return await this.usersRepository.create(newUser)
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		const existedUser = await this.usersRepository.find(dto.email);
		if(!existedUser)
			return false;
		const newUser = new User(existedUser.email, existedUser.name, existedUser.password);
		return newUser.comparePassword(dto.password);
	}
}
