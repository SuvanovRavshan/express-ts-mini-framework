import { App } from '../src/app';
import { boot } from '../src/main';
import request from 'supertest';

let application: App;

beforeAll(async () => {
	const { app } = await boot;
	application = app;
});

describe('Users e2e', () => {
	it('Register - error', async () => {
		const res = await request(application.app)
			.post('/users/register')
			.send({ email: 'a@a.ru', password: '1' });
		expect(res.statusCode).toBe(422);
	});

	it('Login - Success', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: '5555123' });
		expect(res.body.jwt).not.toBeUndefined();
	});

	it('Login - Error', async () => {
		const res = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: '1' });
		expect(res.statusCode).toBe(422);
	});

	it('Info - Success', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: '5555123' });
		const res = await request(application.app)
			.get('/users/info').set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.body.email).toBe('test@gmail.com');
	});

	it('Info - Error', async () => {
		const login = await request(application.app)
			.post('/users/login')
			.send({ email: 'test@gmail.com', password: '111' });
		const res = await request(application.app)
			.get('/users/info').set('Authorization', `Bearer ${login.body.jwt}`);
		expect(res.statusCode).toBe(401);
	});
})

afterAll(() => {
	application.close();
})
