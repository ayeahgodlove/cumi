import sequelize from "@database/db-sequelize.config";
import { DataTypes } from "sequelize";

// Import existing models
import defineEvent from "@data/entities/event";
import defineCourse from "@data/entities/course";
import defineUser from "@data/entities/user";
import defineCategory from "@data/entities/category";

const Event = defineEvent(sequelize, DataTypes);
const Course = defineCourse(sequelize, DataTypes);
const User = defineUser(sequelize, DataTypes);
const Category = defineCategory(sequelize, DataTypes);

export async function seedEventsAndCourses() {
  try {
    console.log('Starting to seed events and courses...');

    // First, ensure we have a user and category
    const [user] = await User.findOrCreate({
      where: { id: 'user-001' },
      defaults: {
        id: 'user-001',
        name: 'CumiTech Admin',
        email: 'admin@cumitech.com',
        password: 'hashedpassword',
        role: 'admin'
      }
    });

    const [category] = await Category.findOrCreate({
      where: { id: 'cat-001' },
      defaults: {
        id: 'cat-001',
        name: 'Technology',
        slug: 'technology',
        description: 'Technology related courses and events'
      }
    });

    // Seed Events
    const events = [
      {
        id: 'evt-001',
        title: 'Web Development Workshop',
        slug: 'web-development-workshop',
        description: 'Learn modern web development with React, Node.js, and modern tools. Perfect for beginners and intermediate developers.',
        imageUrl: '/images/events/web-dev-workshop.jpg',
        eventDate: new Date('2024-02-15T10:00:00Z'),
        location: 'Bamenda Tech Hub, Northwest Cameroon',
        userId: user.id,
        capacity: 50,
        price: 25000,
        status: 'upcoming'
      },
      {
        id: 'evt-002',
        title: 'AI & Machine Learning Conference',
        slug: 'ai-ml-conference',
        description: 'Explore the latest trends in Artificial Intelligence and Machine Learning. Featuring industry experts and hands-on workshops.',
        imageUrl: '/images/events/ai-conference.jpg',
        eventDate: new Date('2024-03-20T09:00:00Z'),
        location: 'Douala Convention Center, Littoral Cameroon',
        userId: user.id,
        capacity: 200,
        price: 50000,
        status: 'upcoming'
      },
      {
        id: 'evt-003',
        title: 'Startup Pitch Competition',
        slug: 'startup-pitch-competition',
        description: 'Showcase your innovative startup ideas to investors and industry leaders. Win funding and mentorship opportunities.',
        imageUrl: '/images/events/startup-pitch.jpg',
        eventDate: new Date('2024-04-10T14:00:00Z'),
        location: 'Yaoundé Business Center, Center Cameroon',
        userId: user.id,
        capacity: 100,
        price: 0,
        status: 'upcoming'
      },
      {
        id: 'evt-004',
        title: 'Cybersecurity Awareness Seminar',
        slug: 'cybersecurity-awareness-seminar',
        description: 'Learn about the latest cybersecurity threats and how to protect your digital assets. Essential for businesses and individuals.',
        imageUrl: '/images/events/cybersecurity-seminar.jpg',
        eventDate: new Date('2024-05-05T11:00:00Z'),
        location: 'Buea Tech Park, Southwest Cameroon',
        userId: user.id,
        capacity: 75,
        price: 15000,
        status: 'upcoming'
      },
      {
        id: 'evt-005',
        title: 'Digital Marketing Masterclass',
        slug: 'digital-marketing-masterclass',
        description: 'Master digital marketing strategies including SEO, social media marketing, content marketing, and analytics.',
        imageUrl: '/images/events/digital-marketing.jpg',
        eventDate: new Date('2024-06-15T09:30:00Z'),
        location: 'Garoua Innovation Hub, North Cameroon',
        userId: user.id,
        capacity: 60,
        price: 30000,
        status: 'upcoming'
      }
    ];

    for (const eventData of events) {
      await Event.findOrCreate({
        where: { id: eventData.id },
        defaults: eventData
      });
    }

    // Seed Courses
    const courses = [
      {
        id: 'crs-001',
        title: 'Complete React Development Course',
        slug: 'complete-react-development-course',
        description: 'Master React.js from basics to advanced concepts. Build real-world applications with hooks, context, and modern React patterns.',
        imageUrl: '/images/courses/react-course.jpg',
        userId: user.id,
        categoryId: category.id,
        authorName: 'CumiTech Team',
        duration: '8 weeks',
        level: 'beginner',
        price: 75000,
        isPublished: true
      },
      {
        id: 'crs-002',
        title: 'Node.js Backend Development',
        slug: 'nodejs-backend-development',
        description: 'Learn server-side JavaScript with Node.js. Build RESTful APIs, work with databases, and deploy applications.',
        imageUrl: '/images/courses/nodejs-course.jpg',
        userId: user.id,
        categoryId: category.id,
        authorName: 'CumiTech Team',
        duration: '6 weeks',
        level: 'intermediate',
        price: 65000,
        isPublished: true
      },
      {
        id: 'crs-003',
        title: 'Full-Stack JavaScript Development',
        slug: 'fullstack-javascript-development',
        description: 'Complete full-stack development course covering React, Node.js, MongoDB, and deployment strategies.',
        imageUrl: '/images/courses/fullstack-course.jpg',
        userId: user.id,
        categoryId: category.id,
        authorName: 'CumiTech Team',
        duration: '12 weeks',
        level: 'beginner',
        price: 120000,
        isPublished: true
      },
      {
        id: 'crs-004',
        title: 'Python for Data Science',
        slug: 'python-data-science',
        description: 'Learn Python programming for data analysis, machine learning, and data visualization using popular libraries.',
        imageUrl: '/images/courses/python-datascience.jpg',
        userId: user.id,
        categoryId: category.id,
        authorName: 'CumiTech Team',
        duration: '10 weeks',
        level: 'intermediate',
        price: 85000,
        isPublished: true
      },
      {
        id: 'crs-005',
        title: 'UI/UX Design Fundamentals',
        slug: 'ui-ux-design-fundamentals',
        description: 'Master user interface and user experience design principles. Learn design tools and create beautiful, functional interfaces.',
        imageUrl: '/images/courses/ui-ux-course.jpg',
        userId: user.id,
        categoryId: category.id,
        authorName: 'CumiTech Team',
        duration: '6 weeks',
        level: 'beginner',
        price: 55000,
        isPublished: true
      },
      {
        id: 'crs-006',
        title: 'Mobile App Development with React Native',
        slug: 'mobile-app-development-react-native',
        description: 'Build cross-platform mobile applications using React Native. Learn navigation, state management, and native features.',
        imageUrl: '/images/courses/react-native-course.jpg',
        userId: user.id,
        categoryId: category.id,
        authorName: 'CumiTech Team',
        duration: '8 weeks',
        level: 'intermediate',
        price: 90000,
        isPublished: true
      }
    ];

    for (const courseData of courses) {
      await Course.findOrCreate({
        where: { id: courseData.id },
        defaults: courseData
      });
    }

    console.log('Successfully seeded events and courses!');
    console.log(`Created ${events.length} events and ${courses.length} courses`);

  } catch (error) {
    console.error('Error seeding events and courses:', error);
    throw error;
  }
}

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedEventsAndCourses()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
