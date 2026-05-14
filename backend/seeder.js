const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Job = require('./models/Job');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
  try {
    await User.deleteMany();
    await Job.deleteMany();

    const employer1 = await User.create({
      name: 'Tech Corp Admin',
      email: 'admin@techcorp.com',
      password: 'password123',
      role: 'employer',
      companyName: 'Tech Corp Inc.',
      bio: 'Leading technology company building the future.'
    });

    const employer2 = await User.create({
      name: 'Design Studio Lead',
      email: 'lead@designstudio.com',
      password: 'password123',
      role: 'employer',
      companyName: 'Creative Design Studio',
      bio: 'Award winning design agency.'
    });

    const candidate1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'candidate',
      bio: 'Experienced full stack developer',
      skills: ['React', 'Node.js', 'MongoDB']
    });

    await Job.create([
      {
        title: 'Senior Frontend Developer',
        description: 'We are looking for an experienced React developer to join our team.',
        requirements: ['3+ years React', 'TypeScript', 'Redux'],
        salary: 120000,
        location: 'San Francisco, CA (Hybrid)',
        type: 'Full-time',
        category: 'Technology',
        employer: employer1._id,
        deadline: new Date('2026-12-31')
      },
      {
        title: 'Backend Node.js Engineer',
        description: 'Join our core platform team building scalable microservices.',
        requirements: ['Node.js', 'Express', 'MongoDB', 'Docker'],
        salary: 130000,
        location: 'Remote',
        type: 'Remote',
        category: 'Technology',
        employer: employer1._id,
        deadline: new Date('2026-11-30')
      },
      {
        title: 'UI/UX Designer',
        description: 'Create beautiful user experiences for our next generation products.',
        requirements: ['Figma', 'Prototyping', 'User Research'],
        salary: 95000,
        location: 'New York, NY',
        type: 'Full-time',
        category: 'Design',
        employer: employer2._id,
        deadline: new Date('2026-10-15')
      }
    ]);

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
