const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Book = require('../models/Book');

const seedData = async () => {
      try {
            await mongoose.connect(process.env.MONGODB_URI);
            console.log('MongoDB connected for seeding...');

            await User.deleteMany();
            await Book.deleteMany();
            console.log('Existing data cleared.');

            // Seed Users
            const admin = await User.create({
                  name: 'System Admin',
                  email: 'admin@example.com',
                  password: 'adminpassword123',
                  role: 'admin'
            });

            await User.create([
                  {
                        name: 'Jonh Wick',
                        email: 'wick@example.com',
                        password: 'password123',
                        role: 'user'
                  },
                  {
                        name: 'John Smith',
                        email: 'smith@example.com',
                        password: 'password123',
                        role: 'user'
                  }
            ]);

            console.log('Users seeded successfully (Admin: admin@example.com / adminpassword123)');

            // Seed Books
            const books = [
                  {
                        title: 'Clean Code',
                        author: 'Robert C. Martin',
                        description: 'A Code of Conduct for Professional Programmers.',
                        isbn: '9780132350884',
                        category: 'Software Engineering',
                        publishedYear: 2008,
                        price: 42.99,
                        stock: 15,
                        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400'
                  },
                  {
                        title: 'Designing Data-Intensive Applications',
                        author: 'Martin Kleppmann',
                        description: 'The Big Ideas Behind Reliable, Scalable, and Maintainable Systems.',
                        isbn: '9781449373320',
                        category: 'Database & Systems',
                        publishedYear: 2017,
                        price: 49.99,
                        stock: 8,
                        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400'
                  },
                  {
                        title: 'The Pragmatic Programmer',
                        author: 'Andrew Hunt, David Thomas',
                        description: 'Your Journey To Mastery, 20th Anniversary Edition.',
                        isbn: '9780135957059',
                        category: 'Software Engineering',
                        publishedYear: 2019,
                        price: 39.95,
                        stock: 3, // Low stock indicator test
                        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400'
                  },
                  {
                        title: 'JavaScript: The Good Parts',
                        author: 'Douglas Crockford',
                        description: 'Unearthing the Excellence in JavaScript.',
                        isbn: '9780596517748',
                        category: 'Web Development',
                        publishedYear: 2008,
                        price: 29.99,
                        stock: 12,
                        coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400'
                  },
                  {
                        title: 'Docker Deep Dive',
                        author: 'Nigel Poulton',
                        description: 'Zero to Hero guide for Docker and containerization.',
                        isbn: '9781916585256',
                        category: 'DevOps',
                        publishedYear: 2020,
                        price: 34.50,
                        stock: 20,
                        coverImage: 'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400'
                  }
            ];

            await Book.insertMany(books);
            console.log('Books seeded successfully.');

            process.exit(0);
      } catch (error) {
            console.error(`Error with data seeding: ${error.message}`);
            process.exit(1);
      }
};

seedData();