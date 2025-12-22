import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const registerDto = {
    email: 'test@example.com',
    password: 'password123',
    fullName: 'Test User',
    phoneNumber: '+1234567890',
  };

  const loginDto = {
    email: 'test@example.com',
    password: 'password123',
  };

  it('/auth/register (POST)', async () => {
    // Use current time + random to ensure uniqueness across runs
    const randomEmail = `test_${Date.now()}_${Math.floor(Math.random() * 1000)}@example.com`;
    const randomPhone = `+880${Math.floor(100000000 + Math.random() * 900000000)}`;
    registerDto.email = randomEmail;
    registerDto.phoneNumber = randomPhone;
    loginDto.email = randomEmail;

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerDto);

    if (response.status !== 201) {
      console.error('Register Failed:', response.body);
    }
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.email).toBe(randomEmail.toLowerCase());
    expect(response.body).not.toHaveProperty('password');
    expect(response.body).not.toHaveProperty('verification');
  });

  it('/auth/login (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    if (response.status !== 201) {
      console.error('Login Failed:', response.body);
    }
    expect(response.status).toBe(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    accessToken = response.body.accessToken;
    refreshToken = response.body.refreshToken;
  });

  it('/auth/refresh (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken })
      .expect(201);

    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
    expect(response.body.refreshToken).not.toBe(refreshToken); // Rotation check
  });

  it('/auth/logout (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });
});
