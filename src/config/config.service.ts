import { inject, injectable } from 'inversify';
import 'reflect-metadata';
import { IConfigService } from './config.service.interface';
import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { TYPES } from '../types';
import { ILogger } from '../logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService{
	private config: DotenvParseOutput;
	constructor(
		@inject(TYPES.ILogger) private logger: ILogger
	) {
		const result: DotenvConfigOutput = config();
		if(result.error) {
			this.logger.error(`[${this.constructor.name}] Can\'t read .env or file not exist`);
		} else {
			this.logger.log(`[${this.constructor.name}] Config .env loaded`);
			this.config = result.parsed as DotenvParseOutput;
		}
	}

	get<T extends string | number>(key: string): T {
		return this.config[key] as T;
	}
}
