import { IUsersService } from './users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './entities/user.entity';
import 'reflect-metadata';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersService implements IUsersService{
	constructor(@inject(TYPES.ConfigService) private configService: IConfigService) {
	}
	async createUser({ email, name, password }: UserRegisterDto): Promise<User | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get<number>('salt');
		await newUser.setPassword(password, salt);
		// проверка что он есть?
		// если есть - возвращаем null
		// если нет создаем и его возвращаем
		return null;
	}

	async validateUser(dto: UserLoginDto): Promise<boolean> {
		return true;
	}
}
