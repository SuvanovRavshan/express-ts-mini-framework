import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HTTPError } from '../errors/http-error.class';
import { inject, injectable } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { TYPES } from '../types';
import 'reflect-metadata';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { IUsersService } from './users.service.interface';
import { ValidateMiddleware } from '../middlewares/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger,
							@inject(TYPES.UsersService) private usersService: IUsersService,
							@inject(TYPES.ConfigService) private configService: IConfigService,) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				name: this.constructor.name,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{
				path: '/login',
				method: 'post',
				func: this.login,
				name: this.constructor.name,
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				path: '/info',
				method: 'get',
				func: this.info,
				name: this.constructor.name,
			},
		]);
	}

	async login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.validateUser(body);
		if (!result)
			return next(new HTTPError(401, 'unauthorized', 'Permission error'));
		const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
		this.ok(res, { jwt });
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.createUser(body);
		if (!result)
			return next(new HTTPError(422, 'email already exist'));
		this.ok(res, { email: result.email, id: result.id });
	}

	async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.findUser(user);
		if (!result)
			return next(new HTTPError(422, 'email already exist'));
		this.ok(res, { email: result.email, id: result.id });
	}

	private signJWT(email: string, secret: string) {
		return new Promise<string>((resolve, reject) => {
			sign({
					email,
					iat: Math.floor(Date.now() / 1000),

				}, secret, {
					algorithm: 'HS256',
				},
				(err, token) => {
					if(err)
						reject(err);
					resolve(token as string);
				});
		});
	}
}
