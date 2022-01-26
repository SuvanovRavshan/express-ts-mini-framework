import { NextFunction, Request, Response, Router } from 'express';

export interface RouteInterface {
	path: string;
	name: string;
	func: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
}

export type ExpressReturnType = Response<any, Record<string, any>>;
