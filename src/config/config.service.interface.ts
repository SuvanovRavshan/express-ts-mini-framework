export interface IConfigService {
	get: <T extends string | number>(key: string) => T;
}
