import { App } from 'supertest/types';
import AppDataSource from '../src/shared/infra/typeorm/data-source';
import createApp from '../src/shared/infra/http/server';
import { closeRateLimiterConnection } from '../src/shared/middlewares/rateLimiter';
import request from 'supertest';

describe('Create User', () => {
  let app: App;

  beforeEach(async () => {
    app = (await createApp()) as unknown as App;
    console.log('✓ Test server ready (supertest will mock the port)');
  });

  afterEach(async () => {
    const entities = AppDataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = AppDataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM ${entity.tableName};`);
    }

    await AppDataSource.destroy();
    await closeRateLimiterConnection();

    // Aguardar um pouco para garantir que todas as conexões sejam fechadas
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  it('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
    expect(response.body.email).toBe('john.doe@example.com');
  });

  it('should not be able to create a user with existing email', async () => {
    await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    const response = await request(app).post('/users').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '654321',
    });

    expect(response.status).toBe(409);
    expect(response.body).toHaveProperty(
      'message',
      'Email address already used.',
    );
  });
});
