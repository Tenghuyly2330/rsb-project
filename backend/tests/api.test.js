const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../src/app');
const User = require('../src/models/User');
const Book = require('../src/models/Book');

let userToken;
let adminToken;
let createdBookId;

beforeAll(async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bookdb_test';
  await mongoose.connect(mongoUri);
  await User.deleteMany({});
  await Book.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
});


describe('Auth Endpoints', () => {
  it('should register a new normal user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
        role: 'user'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
    userToken = res.body.data.token;
  });

  it('should register an admin user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Admin User',
        email: 'adminuser@example.com',
        password: 'password123',
        role: 'admin'
      });
    expect(res.statusCode).toEqual(201);
    adminToken = res.body.data.token;
  });

  it('should login user and return JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should fail login with wrong credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
  });
});

describe('Book Endpoints', () => {
  it('should fail creating a book if user is non-admin', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        title: 'Unauthorized Book',
        author: 'No One',
        description: 'Test',
        isbn: '1111111111',
        category: 'Test',
        publishedYear: 2023,
        price: 10,
        stock: 5
      });
    expect(res.statusCode).toEqual(403);
  });

  it('should create a book successfully if admin', async () => {
    const res = await request(app)
      .post('/api/books')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        title: 'Test Driven Development',
        author: 'Kent Beck',
        description: 'By Example.',
        isbn: '9780321146533',
        category: 'Software Engineering',
        publishedYear: 2002,
        price: 35.00,
        stock: 10
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body.data).toHaveProperty('_id');
    createdBookId = res.body.data._id;
  });

  it('should get list of books with pagination', async () => {
    const res = await request(app).get('/api/books?page=1&limit=10');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.pagination.total).toBe(1);
  });

  it('should get a single book by ID', async () => {
    const res = await request(app).get(`/api/books/${createdBookId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.title).toBe('Test Driven Development');
  });

  it('should delete a book if admin', async () => {
    const res = await request(app)
      .delete(`/api/books/${createdBookId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(200);
  });
});