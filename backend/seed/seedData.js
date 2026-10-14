import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';
import SavedJob from '../models/SavedJob.js';
import PrepQuestion from '../models/PrepQuestion.js';
import Quiz from '../models/Quiz.js';
import CompanyGuide from '../models/CompanyGuide.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedAll = async () => {
  try {
    await connectDB();
    console.log('Clearing existing database collections...');

    await User.deleteMany();
    await Company.deleteMany();
    await Job.deleteMany();
    await Application.deleteMany();
    await SavedJob.deleteMany();
    await PrepQuestion.deleteMany();
    await Quiz.deleteMany();
    await CompanyGuide.deleteMany();

    console.log('Creating users...');

    // Note: User model has pre('save') hook that hashes password when changed.
    // Creating directly with User.create will trigger pre('save').
    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@careerforge.com',
      password: 'password123',
      role: 'admin',
      bio: 'Platform Master Administrator oversees job quality and verified recruiters.',
      location: 'San Francisco, CA',
    });

    const recruiter1 = await User.create({
      name: 'Elena Rostova',
      email: 'recruiter@techcorp.com',
      password: 'password123',
      role: 'recruiter',
      bio: 'Senior Technical Recruiter scouting global engineering talent.',
      location: 'New York, NY',
    });

    const recruiter2 = await User.create({
      name: 'Marcus Vance',
      email: 'marcus@cloudscale.io',
      password: 'password123',
      role: 'recruiter',
      bio: 'VP of Talent Acquisition at CloudScale Solutions.',
      location: 'Austin, TX',
    });

    const jobseeker1 = await User.create({
      name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      role: 'jobseeker',
      bio: 'Full Stack Software Engineer with 3+ years building scalable web apps with React, Node.js, and TypeScript.',
      location: 'Seattle, WA',
      currentTitle: 'Full Stack Developer',
      experienceLevel: 'Mid-Level',
      skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'REST APIs'],
      phone: '+1 (555) 234-5678',
      education: [
        {
          degree: 'B.S. in Computer Science',
          institution: 'University of Washington',
          year: '2021',
        },
      ],
      experience: [
        {
          title: 'Frontend Engineer',
          company: 'PixelSoft Solutions',
          duration: '2022 - Present',
          description: 'Architected responsive UI components and reduced initial bundle load times by 35%.',
        },
      ],
      resume: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        originalName: 'Alex_Rivera_Resume.pdf',
        uploadedAt: new Date(),
      },
    });

    const jobseeker2 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      password: 'password123',
      role: 'jobseeker',
      bio: 'Frontend enthusiast passionate about micro-frontends, accessible UI systems, and Next.js.',
      location: 'San Francisco, CA',
      currentTitle: 'Senior Frontend Developer',
      experienceLevel: 'Senior',
      skills: ['React', 'Next.js', 'Redux', 'GraphQL', 'Tailwind CSS', 'Jest', 'TypeScript'],
      phone: '+1 (555) 876-5432',
      education: [
        {
          degree: 'B.S. Software Engineering',
          institution: 'UC Berkeley',
          year: '2019',
        },
      ],
      experience: [
        {
          title: 'Senior Frontend Dev',
          company: 'HyperGrowth Tech',
          duration: '2020 - 2024',
          description: 'Led design system migration and implemented high-performance state management.',
        },
      ],
      resume: {
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        originalName: 'Sarah_Chen_Senior_Frontend.pdf',
        uploadedAt: new Date(),
      },
    });

    console.log('Creating companies...');
    const company1 = await Company.create({
      name: 'Apex Innovations',
      description: 'Apex Innovations builds next-generation AI enterprise tooling and collaborative cloud workspaces utilized by Fortune 500 teams worldwide.',
      website: 'https://apexinnovations.example.com',
      location: 'San Francisco, CA (Remote-First)',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      industry: 'Artificial Intelligence & SaaS',
      size: '201-500',
      recruiter: recruiter1._id,
      isVerified: true,
    });

    const company2 = await Company.create({
      name: 'CloudScale Systems',
      description: 'CloudScale provides mission-critical infrastructure automation, serverless observability, and distributed database services.',
      website: 'https://cloudscale.example.com',
      location: 'Austin, TX',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=150&auto=format&fit=crop&q=80',
      industry: 'Cloud Infrastructure & DevOps',
      size: '51-200',
      recruiter: recruiter2._id,
      isVerified: true,
    });

    const company3 = await Company.create({
      name: 'FinFlow Global',
      description: 'FinFlow is the modern payment processing infrastructure for fast-growing internet businesses, handling billions in global transactions.',
      website: 'https://finflow.example.com',
      location: 'New York, NY',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=150&auto=format&fit=crop&q=80',
      industry: 'Fintech & Payments',
      size: '500-1000',
      recruiter: recruiter1._id,
      isVerified: true,
    });

    // Link companies back to recruiters
    recruiter1.company = company1._id;
    await recruiter1.save();
    recruiter2.company = company2._id;
    await recruiter2.save();

    console.log('Creating job postings...');
    const jobs = await Job.create([
      {
        title: 'Senior Full Stack Engineer (MERN / TypeScript)',
        company: company1._id,
        recruiter: recruiter1._id,
        description: 'We are seeking an experienced Full Stack Engineer to lead the architecture and scaling of our core collaboration engine. You will craft responsive React interfaces and optimize Node.js microservices handling millions of events daily.',
        requirements: [
          '5+ years professional experience building web applications with Node.js and React',
          'Strong proficiency in TypeScript, asynchronous programming, and REST/GraphQL APIs',
          'Deep knowledge of MongoDB indexing, schema modeling, and aggregation pipelines',
          'Familiarity with containerization (Docker) and AWS cloud primitives',
        ],
        responsibilities: [
          'Design and implement high-availability backend APIs in Express and Node.js',
          'Build intuitive, accessible frontend user experiences using React and Tailwind CSS',
          'Collaborate with product designers and engineers across timezone boundaries',
          'Mentor junior and mid-level engineers through code reviews and design sessions',
        ],
        skillsRequired: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'Tailwind CSS', 'Docker'],
        location: 'San Francisco, CA',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salaryMin: 140000,
        salaryMax: 185000,
        salaryCurrency: 'USD',
        status: 'active',
        viewsCount: 142,
        applicantsCount: 1,
      },
      {
        title: 'Frontend React Developer',
        company: company1._id,
        recruiter: recruiter1._id,
        description: 'Join our client-facing product squad to create slick, responsive, and delightful web applications. You will translate Figma wireframes into pixel-perfect modular React code.',
        requirements: [
          '2+ years of hands-on experience with modern React (hooks, context, router)',
          'High proficiency in CSS frameworks like Tailwind CSS',
          'Understanding of performance optimization, code splitting, and web vitals',
        ],
        responsibilities: [
          'Develop reusable components in React and maintain our internal design system',
          'Integrate RESTful endpoints and handle optimistic client states gracefully',
          'Write unit and integration tests using Vitest and React Testing Library',
        ],
        skillsRequired: ['React', 'JavaScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Git'],
        location: 'Remote',
        workMode: 'Remote',
        jobType: 'Full-time',
        experienceLevel: 'Junior',
        salaryMin: 85000,
        salaryMax: 110000,
        salaryCurrency: 'USD',
        status: 'active',
        viewsCount: 95,
        applicantsCount: 1,
      },
      {
        title: 'Cloud DevOps & Site Reliability Engineer',
        company: company2._id,
        recruiter: recruiter2._id,
        description: 'CloudScale is looking for an experienced SRE/DevOps Engineer to own our Kubernetes clusters, automated CI/CD pipelines, and multi-region infrastructure.',
        requirements: [
          '3+ years managing production infrastructure on AWS or GCP',
          'Strong experience with Terraform, Kubernetes, Helm, and GitHub Actions',
          'Proficiency with monitoring stacks like Prometheus, Grafana, and Datadog',
        ],
        responsibilities: [
          'Automate zero-downtime deployment pipelines for microservices',
          'Maintain 99.99% system uptime and respond to critical incidents',
          'Implement automated security scanning and IAM access controls',
        ],
        skillsRequired: ['DevOps', 'Kubernetes', 'AWS', 'Docker', 'Terraform', 'CI/CD'],
        location: 'Austin, TX',
        workMode: 'Hybrid',
        jobType: 'Full-time',
        experienceLevel: 'Mid-Level',
        salaryMin: 125000,
        salaryMax: 160000,
        salaryCurrency: 'USD',
        status: 'active',
        viewsCount: 78,
        applicantsCount: 0,
      },
      {
        title: 'Backend Systems Engineer (Node.js & Databases)',
        company: company3._id,
        recruiter: recruiter1._id,
        description: 'FinFlow is expanding its transaction processing team. You will build high-throughput ledger services that guarantee idempotency and real-time reconciliation.',
        requirements: [
          '4+ years working with Node.js, relational databases, or NoSQL stores',
          'Understanding of distributed consensus, message queues (Kafka/RabbitMQ), and ACID guarantees',
          'Passion for clean architecture and strict unit test coverage',
        ],
        responsibilities: [
          'Architect resilient payment processing microservices',
          'Optimize database queries and implement Redis caching layers',
          'Participate in on-call rotations and write clear engineering documentation',
        ],
        skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Redis', 'PostgreSQL', 'Microservices'],
        location: 'New York, NY',
        workMode: 'On-site',
        jobType: 'Full-time',
        experienceLevel: 'Senior',
        salaryMin: 155000,
        salaryMax: 195000,
        salaryCurrency: 'USD',
        status: 'active',
        viewsCount: 112,
        applicantsCount: 0,
      },
      {
        title: 'Full Stack Software Engineer Intern',
        company: company2._id,
        recruiter: recruiter2._id,
        description: 'Kickstart your engineering career with a paid 4-month summer internship! You will work side-by-side with senior mentors building real features deployed to production users.',
        requirements: [
          'Currently pursuing or recently graduated with a degree in Computer Science or related bootcamp',
          'Foundational understanding of JavaScript, React, and Node.js or Python',
          'Curiosity, eagerness to learn, and collaborative mindset',
        ],
        responsibilities: [
          'Implement user-facing features under guidance of senior staff',
          'Participate in daily standups and sprint retrospectives',
          'Present a final capstone engineering project to company leadership',
        ],
        skillsRequired: ['JavaScript', 'React', 'Node.js', 'Git', 'Problem Solving'],
        location: 'Austin, TX',
        workMode: 'Hybrid',
        jobType: 'Internship',
        experienceLevel: 'Fresher',
        salaryMin: 55000,
        salaryMax: 70000,
        salaryCurrency: 'USD',
        status: 'active',
        viewsCount: 230,
        applicantsCount: 0,
      },
    ]);

    console.log('Creating sample job applications...');
    await Application.create([
      {
        job: jobs[0]._id,
        applicant: jobseeker1._id,
        resumeUrl: jobseeker1.resume.url,
        resumeName: jobseeker1.resume.originalName,
        coverLetter: 'I have 3+ years building MERN stack architectures with TypeScript and would love to contribute to Apex Innovations!',
        status: 'Shortlisted',
        recruiterNotes: 'Impressive GitHub contributions and solid experience with MongoDB indexing.',
        history: [
          { status: 'Applied', note: 'Submitted application', timestamp: new Date(Date.now() - 3 * 86400000) },
          { status: 'Under Review', note: 'Resume reviewed by recruiter Elena', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'Shortlisted', note: 'Scheduled for technical screening call', timestamp: new Date(Date.now() - 86400000) },
        ],
      },
      {
        job: jobs[1]._id,
        applicant: jobseeker2._id,
        resumeUrl: jobseeker2.resume.url,
        resumeName: jobseeker2.resume.originalName,
        coverLetter: 'Specialized in frontend performance and modern component patterns.',
        status: 'Under Review',
        recruiterNotes: 'Strong portfolio projects in React and Tailwind.',
        history: [
          { status: 'Applied', note: 'Submitted application', timestamp: new Date(Date.now() - 2 * 86400000) },
          { status: 'Under Review', note: 'Profile under review', timestamp: new Date(Date.now() - 86400000) },
        ],
      },
    ]);

    console.log('Creating Wishlist saved jobs...');
    await SavedJob.create({
      user: jobseeker1._id,
      job: jobs[1]._id,
    });

    console.log('Creating Interview Preparation Questions...');
    await PrepQuestion.create([
      {
        category: 'Frontend',
        topic: 'React Hooks & Rendering',
        difficulty: 'Medium',
        question: 'What is the key difference between useEffect, useLayoutEffect, and useMemo in React?',
        answer: '`useEffect` runs asynchronously after the DOM has been painted on the screen, making it ideal for data fetching, timers, and logging without blocking visual render.\n\n`useLayoutEffect` runs synchronously immediately after DOM mutations but before the browser paints. It is used when you need to read DOM layout (e.g. element dimensions/scroll position) and synchronously re-render to prevent layout flickering.\n\n`useMemo` caches the result of a calculation between re-renders to prevent expensive recalculations.',
        codeExample: `// useEffect: Non-blocking side effect
useEffect(() => {
  fetchUserData(userId);
}, [userId]);

// useLayoutEffect: Prevents visual flicker
useLayoutEffect(() => {
  const { height } = tooltipRef.current.getBoundingClientRect();
  setPosition(height > 200 ? 'top' : 'bottom');
}, []);

// useMemo: Cache expensive computation
const filteredList = useMemo(() => {
  return items.filter(item => item.value > threshold);
}, [items, threshold]);`,
        tags: ['React', 'Hooks', 'Performance', 'DOM'],
        popularInCompanies: ['Meta', 'Uber', 'Airbnb', 'Amazon'],
        likes: 42,
      },
      {
        category: 'Backend',
        topic: 'Node.js Event Loop',
        difficulty: 'Hard',
        question: 'Explain the phases of the Node.js Event Loop and the role of microtask queues (process.nextTick & Promise).',
        answer: 'The Node.js event loop consists of 6 primary phases:\n1. **Timers**: Executes callbacks scheduled by `setTimeout()` and `setInterval()`.\n2. **Pending callbacks**: Executes I/O callbacks deferred to the next loop iteration.\n3. **Idle, prepare**: Internal use only.\n4. **Poll**: Retrieves new I/O events and executes related callbacks.\n5. **Check**: Executes callbacks registered with `setImmediate()`.\n6. **Close callbacks**: Executes close event handlers (e.g., `socket.on(\'close\')`).\n\n**Microtasks:** `process.nextTick` queue and Promise microtasks run *immediately* after the current operation finishes, before the event loop transitions to the next phase or even next loop tick.',
        codeExample: `console.log('1: Sync');

setTimeout(() => console.log('2: Timer Macro'), 0);
setImmediate(() => console.log('3: Immediate Macro'));

Promise.resolve().then(() => console.log('4: Promise Micro'));
process.nextTick(() => console.log('5: nextTick Micro'));

// Output Order:
// 1: Sync
// 5: nextTick Micro
// 4: Promise Micro
// 2: Timer Macro
// 3: Immediate Macro`,
        tags: ['Node.js', 'Event Loop', 'Asynchronous', 'JavaScript'],
        popularInCompanies: ['Netflix', 'Stripe', 'PayPal', 'LinkedIn'],
        likes: 67,
      },
      {
        category: 'System Design',
        topic: 'Database Scaling & Caching',
        difficulty: 'Hard',
        question: 'How do you design a distributed caching strategy with Redis, and how do you handle cache stampede and cache penetration?',
        answer: '### Strategies:\n1. **Cache-Aside (Lazy Loading)**: Application queries cache first; on miss, loads from DB and writes to cache.\n2. **Write-Through**: Write to cache and DB simultaneously.\n\n### Common Challenges & Solutions:\n- **Cache Penetration** (Querying non-existent keys repeatedly hitting DB): Use **Bloom filters** or cache null values with a short TTL.\n- **Cache Stampede / Thundering Herd** (Hot key expires and hundreds of requests hit DB concurrently): Implement **Mutex locks** (distributed lock via Redlock or single-flight pattern) or use **Probabilistic Early Expiration (XFetch)**.\n- **Cache Breakdown**: Stagger TTL with random jitter so keys do not expire at the exact same second.',
        codeExample: `// Cache-Aside with Distributed Mutex Lock (Single Flight)
async function getJobWithCache(jobId) {
  const cached = await redis.get(\`job:\${jobId}\`);
  if (cached) return JSON.parse(cached);

  const lockKey = \`lock:job:\${jobId}\`;
  const acquired = await redis.set(lockKey, '1', 'NX', 'EX', 5);

  if (acquired) {
    const job = await JobModel.findById(jobId);
    // Add jitter: 3600s + random 0-300s
    const ttl = 3600 + Math.floor(Math.random() * 300);
    await redis.set(\`job:\${jobId}\`, JSON.stringify(job), 'EX', ttl);
    await redis.del(lockKey);
    return job;
  } else {
    // Wait briefly and retry from cache
    await sleep(50);
    return getJobWithCache(jobId);
  }
}`,
        tags: ['System Design', 'Redis', 'Caching', 'Scalability'],
        popularInCompanies: ['Google', 'Meta', 'Amazon', 'Twitter / X'],
        likes: 89,
      },
      {
        category: 'DSA',
        topic: 'Arrays & Two Pointers',
        difficulty: 'Medium',
        question: 'Solve the 3Sum problem in O(N^2) time complexity and O(1) auxiliary space.',
        answer: 'Sort the array first to allow two-pointer scanning. Loop through the array with pointer `i`. For each `i`, use two pointers `left = i + 1` and `right = n - 1` to find pairs whose sum equals `-nums[i]`. Skip duplicate numbers at `i`, `left`, and `right` to ensure all triplets are unique.',
        codeExample: `function threeSum(nums) {
  nums.sort((a, b) => a - b);
  const result = [];

  for (let i = 0; i < nums.length - 2; i++) {
    if (i > 0 && nums[i] === nums[i - 1]) continue; // Skip duplicates
    let left = i + 1;
    let right = nums.length - 1;

    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right];
      if (sum === 0) {
        result.push([nums[i], nums[left], nums[right]]);
        while (left < right && nums[left] === nums[left + 1]) left++;
        while (left < right && nums[right] === nums[right - 1]) right--;
        left++;
        right--;
      } else if (sum < 0) {
        left++;
      } else {
        right--;
      }
    }
  }
  return result;
}`,
        tags: ['DSA', 'Arrays', 'Two Pointers', 'Sorting'],
        popularInCompanies: ['Google', 'Microsoft', 'Amazon', 'Apple'],
        likes: 54,
      },
      {
        category: 'Full Stack',
        topic: 'Security & Authentication',
        difficulty: 'Medium',
        question: 'Why are HTTP-only cookies preferred over localStorage for storing JWT authentication tokens?',
        answer: 'Storing sensitive JWT tokens in `localStorage` leaves them exposed to **Cross-Site Scripting (XSS)** attacks. Any malicious third-party script, injected npm package, or compromised CDN can read `localStorage.getItem(\'token\')` and exfiltrate credentials.\n\nSetting JWT inside an **HTTP-only, Secure, SameSite cookie** ensures the browser sends the cookie automatically on same-origin requests while JavaScript (`document.cookie`) has zero programmatic access, effectively neutralizing XSS token theft.',
        codeExample: `// Express server configuration:
res.cookie('token', jwtToken, {
  httpOnly: true, // Prevents JavaScript access (XSS protection)
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
  sameSite: 'lax', // CSRF mitigation
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
});`,
        tags: ['Security', 'JWT', 'Cookies', 'XSS', 'Auth'],
        popularInCompanies: ['Stripe', 'Atlassian', 'GitHub'],
        likes: 73,
      },
      {
        category: 'DevOps',
        topic: 'Docker & Multi-Stage Builds',
        difficulty: 'Medium',
        question: 'What is a Docker multi-stage build and why is it essential for production Node.js/React deployments?',
        answer: 'Multi-stage builds allow you to use intermediate container stages (with compilers, devDependencies, test runners) to build your project artifacts, and then copy *only* the compiled static assets or minimal production dependencies into a lightweight final base image (like Alpine).\n\nThis dramatically cuts image size (often from 1.2 GB down to under 50 MB), eliminates attack surface vulnerabilities, and speeds up CI/CD deployment times.',
        codeExample: `# Stage 1: Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production runtime stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`,
        tags: ['Docker', 'DevOps', 'Containers', 'CI/CD'],
        popularInCompanies: ['AWS', 'GitLab', 'Datadog'],
        likes: 38,
      },
    ]);

    console.log('Creating Interactive Technical Quizzes...');
    await Quiz.create([
      {
        title: 'Full Stack React & Node.js Assessment',
        description: 'Test your understanding of full stack web architecture, React component lifecycle, Express middleware, and asynchronous paradigms.',
        category: 'Full Stack',
        difficulty: 'Intermediate',
        durationMinutes: 10,
        badgeName: 'Full Stack Pro',
        questions: [
          {
            questionText: 'Which React hook is specifically designed to memoize computed values between renders?',
            options: ['useCallback', 'useMemo', 'useRef', 'useEffect'],
            correctOptionIndex: 1,
            explanation: 'useMemo returns a memoized value that only recalculates when one of its specified dependencies changes.',
          },
          {
            questionText: 'What is the purpose of "next()" function in Express.js middleware?',
            options: [
              'Terminates the HTTP request immediately',
              'Passes control to the next middleware or route handler in the stack',
              'Reloads the Node server daemon',
              'Parses the incoming JSON request body',
            ],
            correctOptionIndex: 1,
            explanation: 'Calling next() passes execution to the next matching middleware function. If not called, the request hangs.',
          },
          {
            questionText: 'In MongoDB, which operator is used to search for array elements that match specified conditions?',
            options: ['$match', '$elemMatch', '$inArray', '$filter'],
            correctOptionIndex: 1,
            explanation: '$elemMatch matches documents that contain an array field with at least one element matching all specified query criteria.',
          },
          {
            questionText: 'How can you prevent Cross-Site Scripting (XSS) attacks on JWT tokens?',
            options: [
              'Store tokens in localStorage',
              'Store tokens in HTTP-only cookies',
              'Base64 encode the token twice',
              'Pass the token in URL query parameters',
            ],
            correctOptionIndex: 1,
            explanation: 'HTTP-only cookies cannot be accessed by client-side JavaScript, guarding tokens against XSS exfiltration.',
          },
          {
            questionText: 'Which HTTP status code is most appropriate when a resource is successfully created?',
            options: ['200 OK', '201 Created', '204 No Content', '302 Found'],
            correctOptionIndex: 1,
            explanation: '201 Created indicates that the request succeeded and led to the creation of a new resource.',
          },
        ],
      },
      {
        title: 'Frontend Mastery: React & Modern Web',
        description: 'Assess your skills in React patterns, Virtual DOM, CSS-in-JS, and client-side optimization.',
        category: 'Frontend',
        difficulty: 'Beginner',
        durationMinutes: 8,
        badgeName: 'Frontend Specialist',
        questions: [
          {
            questionText: 'What triggers a re-render in a React component?',
            options: [
              'Modifying any local JavaScript variable',
              'Updating state via setState or changes in props',
              'Writing to console.log',
              'Calling a plain helper function',
            ],
            correctOptionIndex: 1,
            explanation: 'State changes (via useState/useReducer) or prop updates from parent components trigger React re-renders.',
          },
          {
            questionText: 'What does the "key" prop do in React list rendering?',
            options: [
              'Provides CSS styling hooks',
              'Helps React identify which items have changed, added, or removed during reconciliation',
              'Stores encrypted data in local storage',
              'Binds keyboard shortcut events',
            ],
            correctOptionIndex: 1,
            explanation: 'Keys provide a stable identity for elements so React reconciliation efficiently reorders without recreating all DOM nodes.',
          },
          {
            questionText: 'What is the Virtual DOM in React?',
            options: [
              'A direct replica of browser window properties',
              'A lightweight JavaScript object representation of the real DOM tree in memory',
              'A replacement for HTML written in WebAssembly',
              'A cloud database for storing DOM trees',
            ],
            correctOptionIndex: 1,
            explanation: 'The Virtual DOM is a fast, in-memory tree representation that React diffs to calculate minimal real DOM updates.',
          },
        ],
      },
      {
        title: 'Backend Systems & Distributed Architecture',
        description: 'Evaluate your knowledge of databases, microservices, REST design, and concurrency.',
        category: 'Backend',
        difficulty: 'Advanced',
        durationMinutes: 12,
        badgeName: 'System Architect',
        questions: [
          {
            questionText: 'According to the CAP theorem, what can a distributed data store guarantee during a network partition (P)?',
            options: [
              'Both Consistency (C) and Availability (A)',
              'Either Consistency (C) or Availability (A), but not both simultaneously',
              'Neither Consistency nor Availability',
              'Guaranteed zero latency',
            ],
            correctOptionIndex: 1,
            explanation: 'When a network partition occurs, a distributed system must choose between returning consistent responses (CP) or remaining available (AP).',
          },
          {
            questionText: 'Which indexing strategy in MongoDB is best for multi-field compound queries?',
            options: [
              'Single field index on the last property',
              'Compound index following the Equality, Sort, Range (ESR) rule',
              'Text index on all fields',
              'Geospatial index',
            ],
            correctOptionIndex: 1,
            explanation: 'The ESR (Equality, Sort, Range) rule provides the most efficient indexing pattern for compound queries in MongoDB.',
          },
        ],
      },
    ]);

    console.log('Creating Company-Specific Interview Guides...');
    await CompanyGuide.create([
      {
        companyName: 'Google',
        tagline: 'Organizing the world’s information and making it universally accessible',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
        overview: 'Google interview loops evaluate four core pillars: Role-Related Knowledge (RRK), General Cognitive Ability (GCA), Leadership, and Googleyness. Coding interviews focus heavily on clean algorithms, time/space complexity analysis, and edge cases.',
        hiringProcess: [
          {
            stepNumber: 1,
            stage: 'Recruiter Screening (30 mins)',
            description: 'Discussion of your resume, career journey, projects, and role alignment.',
            proTip: 'Highlight quantifiable impact (e.g. reduced latency by 40%, shipped feature to 1M users).',
          },
          {
            stepNumber: 2,
            stage: 'Technical Phone Screen (45 mins)',
            description: '1-2 DSA coding problems conducted in a shared Google Doc or CoderPad without compiler execution.',
            proTip: 'Communicate your thought process before writing a single line of code. Write modular helper functions.',
          },
          {
            stepNumber: 3,
            stage: 'Onsite Loop (4-5 rounds)',
            description: '3 coding rounds, 1 System Design round (for L4+), and 1 Googleyness & Leadership round.',
            proTip: 'Clarify constraints early, state big-O complexity upfront, and test your solution with dry-run walkthroughs.',
          },
          {
            stepNumber: 4,
            stage: 'Hiring Committee & Team Matching',
            description: 'An independent hiring committee reviews candidate packet before formal offer formulation.',
            proTip: 'Demonstrate intellectual humility and willingness to learn from feedback.',
          },
        ],
        frequentTopics: ['Binary Trees & Graphs', 'Dynamic Programming', 'Sliding Window', 'Distributed Caching', 'Googleyness Scenarios'],
        sampleQuestions: [
          {
            question: 'Design a distributed rate limiter that handles 100,000 requests per second across global regions.',
            round: 'System Design',
            difficulty: 'Hard',
            tips: 'Mention Token Bucket vs Leaky Bucket algorithms and Redis sliding window counters with synchronization.',
          },
          {
            question: 'Given an array of meeting time intervals, find the minimum number of conference rooms required.',
            round: 'Coding / DSA',
            difficulty: 'Medium',
            tips: 'Use Min-Heap or sort start and end times independently with two pointers.',
          },
        ],
        cultureNotes: [
          'Act with intellectual curiosity and data-driven reasoning',
          'Thrive in ambiguous situations without micromanagement',
          'Focus on user impact above all else',
        ],
      },
      {
        companyName: 'Amazon',
        tagline: 'Earth’s most customer-centric company',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
        overview: 'Amazon heavily tests its 16 Leadership Principles (LPs) across all interview rounds. Expect every interviewer to probe you for STAR format (Situation, Task, Action, Result) behavioral stories alongside technical problems.',
        hiringProcess: [
          {
            stepNumber: 1,
            stage: 'Online Assessment (OA)',
            description: '90-minute Hackerrank assessment with 2 coding problems plus a work style simulation questionnaire.',
            proTip: 'Make sure your code passes all hidden test cases and edge cases (empty inputs, negative numbers, overflow).',
          },
          {
            stepNumber: 2,
            stage: 'Technical Phone Screen',
            description: 'DSA coding question followed by 20 minutes of Leadership Principle deep dive.',
            proTip: 'Prepare 2 solid STAR examples per Leadership Principle, particularly Customer Obsession and Ownership.',
          },
          {
            stepNumber: 3,
            stage: 'The Onsite "Loop" (4-5 rounds)',
            description: 'Includes a "Bar Raiser" whose primary job is ensuring candidate surpasses 50% of current Amazonians.',
            proTip: 'Focus on "I" rather than "we" when detailing actions you personally owned.',
          },
        ],
        frequentTopics: ['Customer Obsession', 'Deep Dive', 'Graphs & BFS/DFS', 'Object-Oriented Design', 'High-Scale Microservices'],
        sampleQuestions: [
          {
            question: 'Tell me about a time you had to make a decision with incomplete information and high stakes.',
            round: 'Behavioral / Leadership Principle',
            difficulty: 'Medium',
            tips: 'Demonstrates Bias for Action and Calculated Risk Taking. Quantify the final outcome.',
          },
          {
            question: 'Design Amazon Locker delivery and notification infrastructure.',
            round: 'System Design',
            difficulty: 'Hard',
            tips: 'Discuss IoT hardware heartbeat, event-driven architecture using SNS/SQS, and state machine transitions.',
          },
        ],
        cultureNotes: [
          'Customer Obsession over competitor focus',
          'Frugality and achieving more with less',
          'Have Backbone; Disagree and Commit',
        ],
      },
      {
        companyName: 'Meta',
        tagline: 'Giving people the power to build community and bring the world closer together',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg',
        overview: 'Meta interviews emphasize rapid coding speed and accuracy. In technical rounds, candidates are expected to solve 2 medium-to-hard LeetCode problems within 45 minutes.',
        hiringProcess: [
          {
            stepNumber: 1,
            stage: 'Technical Screen (45 mins)',
            description: 'Two coding questions solved rapidly in CoderPad with zero fluff.',
            proTip: 'Speed matters: aim for 15-20 minutes per question. Write working code quickly.',
          },
          {
            stepNumber: 2,
            stage: 'Full Onsite Loop (4 rounds)',
            description: '2 Coding rounds (2 problems each), 1 System Design / Product Architecture round, and 1 Behavioral round.',
            proTip: 'Design rounds require rapid component breakdown, API contracts, and database schema definition.',
          },
        ],
        frequentTopics: ['Hash Maps', 'Binary Trees', 'Graphs & Topological Sort', 'News Feed System Design', 'Move Fast Mindset'],
        sampleQuestions: [
          {
            question: 'Design Instagram Stories: uploading, viewing, ephemeral 24h expiration, and view count tracking.',
            round: 'System Design',
            difficulty: 'Hard',
            tips: 'Cover CDN caching of video chunks, Redis sets for distinct viewers, and TTL expiration workers.',
          },
        ],
        cultureNotes: [
          'Move Fast and build high-leverage products',
          'Focus on long-term impact',
          'Be open and communicate transparently',
        ],
      },
    ]);

    console.log('Database successfully populated with rich seed data!');
    console.log('=============================================');
    console.log('Login credentials for testing:');
    console.log('Admin:      admin@careerforge.com     / password123');
    console.log('Recruiter:  recruiter@techcorp.com    / password123');
    console.log('Job Seeker: alex@example.com          / password123');
    console.log('=============================================');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAll();
