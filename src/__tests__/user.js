
const request = require('supertest')
const app = require('../infra/server/')

describe('User Routes', () => {
  const token = 'Bearer <valid-jwt>'; // Replace with real or mock JWT

  test('GET /api/user - should return user info', async () => {
    const res = await request(app)
      .get('/api/user')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id'); // adjust based on response shape
  });

  test('DELETE /api/user - should delete user', async () => {
    const res = await request(app)
      .delete('/api/user')
      .set('Authorization', token);

    expect(res.statusCode).toBe(200);
  });

  test('POST /api/user/register - should register user', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send({ email: 'test@example.com', password: 'pass1234' });

    expect(res.statusCode).toBe(201); // or 200 based on your API
  });

  // Add similar tests for each route: login, validation, password reset, etc.
});
