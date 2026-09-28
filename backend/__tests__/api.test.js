const request = require('supertest');
const { app, server } = require('../server');

describe('API Routing & Health', () => {
  afterAll((done) => {
    // Close the Express server to prevent Jest from hanging
    server.close(done);
  });

  it('should return 200 OK for /health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('healthy');
  });

  it('should return 401 for protected /api/progress without token', async () => {
    const res = await request(app).get('/api/progress');
    expect(res.statusCode).toEqual(401);
    expect(res.body.success).toBe(false);
    expect(res.body.code).toEqual('AUTH_REQUIRED');
  });

  it('should list exams publicly via /api/exams', async () => {
    const res = await request(app).get('/api/exams');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.exams)).toBe(true);
  });
});
