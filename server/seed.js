const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/campchat');
    console.log('✅ Connected to MongoDB for Seeding');

    const adminEmail = process.env.ADMIN_EMAIL || 'namessjcoe@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'password@1234';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists.');
    } else {
      const admin = await User.create({
        name: 'Sardar Vallabhbhai JCOE Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        reputationScore: 999
      });
      console.log('✅ Admin User Created:', admin.email);
    }
    process.exit();
  } catch (error) {
    console.error('❌ Seeding Error:', error);
    process.exit(1);
  }
};

seedAdmin();
