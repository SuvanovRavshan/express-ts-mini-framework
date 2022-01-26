import { Response, Router } from 'express';
import { ExpressReturnType, RouteInterface } from './route.interface';
import { ILogger } from '../logger/logger.interface';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;

	constructor(private logger: ILogger) {
		this._router = Router();
	}

	get router(): Router {
		return this._router;
	}

	public send<T>(res: Response, code: number, message: T): ExpressReturnType {
		res.type('application/json');
		return res.status(code).json(message);
	}

	public ok<T>(res: Response, message: T): ExpressReturnType {
		return this.send<T>(res, 200, message);
	}

	public created(res: Response): ExpressReturnType {
		return res.sendStatus(201);
	}

	public parseControllerNameToPathLowerCase(controllerName: string): string {
		return controllerName.split('Controller')[0].toLowerCase();
	}

	protected bindRoutes(routes: RouteInterface[]): void {
		for (const route of routes) {
			this.logger.log(
				`${route.name} [method: ${route.method}] route: ${this.parseControllerNameToPathLowerCase(
					route.name,
				)}${route.path}`,
			);
			//save context and bind
			const handler = route.func.bind(this);

			this.router[route.method](route.path, handler);
		}
	}
}
