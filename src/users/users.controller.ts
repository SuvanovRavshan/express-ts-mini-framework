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

@injectable()
export class UsersController extends BaseController implements IUserController {
	constructor(@inject(TYPES.ILogger) private loggerService: ILogger,
							@inject(TYPES.UsersService) private usersService: IUsersService) {
		super(loggerService);
		this.bindRoutes([
			{
				path: '/register',
				method: 'post',
				func: this.register,
				name: this.constructor.name,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
			{ path: '/login', method: 'post', func: this.login, name: this.constructor.name },
		]);
	}

	login({ body }: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {

		next(new HTTPError(401, 'unauthorized', 'Permission error'));
	}

	async register({ body }: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction): Promise<void> {
		const result = await this.usersService.createUser(body);
		if (!result)
			return next(new HTTPError(422, 'email already exist'));
		this.ok(res, { email: result.email });
	}
}
