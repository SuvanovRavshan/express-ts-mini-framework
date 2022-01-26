import { User } from './entities/user.entity';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';

export interface IUsersService {
	createUser: (dto: UserRegisterDto) => Promise<User | null>;
	validateUser: (dto: UserLoginDto) => Promise<boolean>;
}
