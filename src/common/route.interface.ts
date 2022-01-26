import { NextFunction, Request, Response, Router } from 'express';
import { IMiddleware } from '../middlewares/middleware.interface';

export interface RouteInterface {
	path: string;
	name: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
