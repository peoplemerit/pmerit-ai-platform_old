// Curriculum Tracks
const CURRICULUM_TRACKS = {
  core: {
    name: "Core Curriculum",
    required: true,
    courses: ["digital-literacy", "career-communication", "critical-thinking", "time-management", "freelancing-intro"]
  },
  remote_careers: {
    name: "Remote Career Specializations",
    tracks: ["admin-va", "tech-fundamentals", "content-creation", "data-research", "customer-support"]
  },
  electives: {
    name: "Electives",
    courses: ["personal-branding", "financial-literacy"]
  }
};

// Sample Course List
const SAMPLE_COURSES = [
  {
    id: "digital-literacy",
    title: "Digital Literacy & Remote Tools",
    track: "core",
    duration: "4 hours",
    assessment: "Quiz + Tool Practice",
    materials: ["google-workspace-guide.pdf", "remote-tools-checklist.pdf"],
    description: "Master essential digital tools for remote work success"
  },
  {
    id: "career-communication",
    title: "Career Communication Skills",
    track: "core",
    duration: "3 hours",
    assessment: "Assignment + AI Review",
    materials: ["communication-strategies.pdf"],
    description: "Develop effective workplace communication skills"
  },
  // ...add more courses as needed
];

// Student Enrollments
const STUDENT_ENROLLMENTS = {
  // Example: 'studentId': { courses: [courseId], progress: { courseId: percentComplete } }
};

// Course Materials
const COURSE_MATERIALS = {
  "digital-literacy": ["google-workspace-guide.pdf", "remote-tools-checklist.pdf"],
  "career-communication": ["communication-strategies.pdf"]
  // etc.
};

// Learning Paths
const LEARNING_PATHS = [
  {
    id: "remote-work-starter",
    name: "Remote Work Starter Path",
    courses: ["digital-literacy", "career-communication", "time-management"],
    prerequisites: []
  }
  // ...add more learning paths if needed
];
