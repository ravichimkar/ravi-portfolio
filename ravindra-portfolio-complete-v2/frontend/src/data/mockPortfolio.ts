import type { PortfolioData } from "@/types/portfolio";
import raviPortrait from "@/assets/ravi-portrait.png.asset.json";

/**
 * Centralized mock data. Replace with API responses from the Spring Boot
 * backend without touching any visual component.
 */
export const mockPortfolio: PortfolioData = {
  profile: {
    name: "Ravindra Sopan Chimkar",
    shortName: "Ravindra Chimkar",
    title: "Software Engineer | Java Developer",
    roles: ["Software Engineer", "Java Developer"],
    tagline: "Building reliable backend systems and modern web applications.",
    location: "Pune, Maharashtra, India",
    email: "ravichimkar2004@gmail.com",
    summary:
      "Software Engineer with hands-on experience in designing, developing, and building scalable backend applications using Java, Spring Boot, Microservices, REST APIs, and MySQL. Strong foundation in Object-Oriented Programming, Data Structures & Algorithms, JWT authentication, database optimization, Docker, and Git. Passionate about building secure, maintainable, and high-performance software solutions.",
    techLine: ["Java", "Spring Boot", "REST APIs", "MySQL"],
    resumeUrl: "/resume/ravindra-chimkar-resume.pdf",
    photoUrl: raviPortrait.url,
  },

  socialLinks: [
    {
      id: "github",
      label: "GitHub",
      url: "https://github.com/ravichimkar",
      handle: "ravichimkar",
      icon: "github",
    },
    {
      id: "linkedin",
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/ravindra-chimkar/",
      handle: "ravindra-chimkar",
      icon: "linkedin",
    },
    {
      id: "leetcode",
      label: "LeetCode",
      url: "https://leetcode.com/u/ravi_chimkar/",
      handle: "ravi_chimkar",
      icon: "leetcode",
    },
  ],

  skills: [
    {
      id: "languages",
      label: "Languages",
      description: "Core programming languages used day to day.",
      skills: [{ name: "Java" }, { name: "SQL" }, { name: "JavaScript" }],
    },
    {
      id: "backend",
      label: "Backend",
      description: "Service design, APIs and application security.",
      skills: [
        { name: "Spring Boot" },
        { name: "Microservices" },
        { name: "Servlets" },
        { name: "JDBC" },
        { name: "REST APIs" },
        { name: "JWT Authentication" },
        { name: "RBAC" },
      ],
    },
    {
      id: "database",
      label: "Database",
      description: "Relational modeling and query performance.",
      skills: [{ name: "MySQL" }, { name: "Query Optimization" }, { name: "Data Modeling" }],
    },
    {
      id: "tools",
      label: "Tools",
      description: "Build, containerization and delivery workflow.",
      skills: [{ name: "Docker" }, { name: "Git" }, { name: "Maven" }, { name: "Postman" }],
    },
    {
      id: "core-cs",
      label: "Core CS",
      description: "Fundamentals behind maintainable systems.",
      skills: [{ name: "Object-Oriented Programming (OOP)" }, { name: "Collections Framework" }],
    },
  ],

  experience: [
    {
      id: "wipro-talentnext",
      program: "Wipro TalentNext",
      role: "Java Full Stack Development",
      organization: "Wipro Limited",
      location: "Pune, India",
      startDate: "July 2025",
      endDate: "October 2025",
      type: "Industry-oriented training program",
      summary:
        "Industry-oriented Java Full Stack Development program covering backend application development with Java and Spring Boot, REST API design, relational databases and the surrounding engineering toolchain.",
      focusAreas: [
        "Java",
        "Spring Boot",
        "REST APIs",
        "SQL",
        "Servlets",
        "Data Structures & Algorithms",
        "MySQL",
        "Maven",
        "Git",
        "Docker",
        "Postman",
        "Object-Oriented Programming",
        "Backend application development",
      ],
    },
  ],

  education: [
    {
      id: "dypit",
      institution: "Dr. D. Y. Patil Institute of Technology, Pune",
      degree: "Bachelor of Engineering (B.E.)",
      field: "Electronics & Telecommunication Engineering",
      startYear: "2022",
      endYear: "2026",
      score: "CGPA: 6.95 / 10",
    },
  ],

  certifications: [
    {
      id: "jetbrains-java-foundations",
      name: "Java Foundations Professional Certificate",
      issuer: "JetBrains",
      date: "Completed August 2026",
      skills: ["Java", "Data Structures", "Object-Oriented Programming"],
    },
    {
      id: "apna-college-alpha-dsa",
      name: "Alpha — DSA with Java",
      issuer: "Apna College",
      skills: ["Data Structures", "Algorithms", "Java"],
    },
    {
      id: "wipro-talentnext-cert",
      name: "Wipro TalentNext — Java Full Stack",
      issuer: "Wipro Limited",
      date: "July 2025 – October 2025",
      skills: ["Java", "Spring Boot", "REST APIs", "MySQL"],
    },
    {
      id: "servicenow-csa",
      name: "ServiceNow Certified System Administrator (CSA)",
      issuer: "ServiceNow",
      date: "Issued February 3, 2026",
    },
    {
      id: "servicenow-cad",
      name: "ServiceNow Certified Application Developer (CAD)",
      issuer: "ServiceNow",
      date: "Issued February 2, 2026",
    },
    {
      id: "google-data-science",
      name: "Foundations of Data Science",
      issuer: "Google · Coursera",
      date: "Completed December 26, 2024",
    },
  ],

  achievements: [
    {
      id: "entc-coding-club",
      title: "Secretary — ENTC Coding Club",
      organization: "ENTC Coding Club",
      institution: "Dr. D. Y. Patil Institute of Technology",
    },
  ],

  projects: [
    {
      id: "credit-score-analysis-tool",
      slug: "credit-score-analysis-tool",
      name: "Credit Score Analysis Tool",
      architecture: "Microservices",
      shortDescription:
        "A microservices-based application focused on credit data processing, credit score analysis and backend reporting.",
      overview:
        "A microservices-based application focused on credit data processing, credit score analysis and backend reporting. The system is split into independent services communicating over secure REST APIs, with JWT-based authentication and a MySQL data layer designed around clean data modeling and query optimization.",
      technologies: [
        "Java",
        "Spring Boot",
        "Microservices",
        "REST APIs",
        "JWT",
        "MySQL",
        "Docker",
      ],
      keyFeatures: [
        "Microservices architecture",
        "Secure REST APIs",
        "JWT-based authentication",
        "Credit data processing",
        "Backend reporting",
      ],
      technicalImplementation: [
        "Spring Boot services structured around independent business capabilities",
        "JWT-based authentication securing service endpoints",
        "MySQL persistence with considered data modeling",
        "Database optimization for credit data queries",
        "Docker containerization for consistent environments",
      ],
      challenges: [
        "Designing service boundaries for credit data processing",
        "Securing inter-service communication with JWT",
        "Optimizing database access for analysis workloads",
      ],
      githubUrl: "https://github.com/ravichimkar/CreditScoreAnalysisTool",
      featured: true,
    },
    {
      id: "claims-processing-system",
      slug: "claims-processing-system",
      name: "Claims Processing System",
      architecture: "Monolithic",
      shortDescription:
        "A backend insurance claim management system supporting claim submission, validation, processing and reporting workflows.",
      overview:
        "A backend insurance claim management system supporting claim submission, validation, processing and reporting workflows. Built as a layered monolithic Spring Boot application with role-based access control, business validation and structured exception handling.",
      technologies: ["Java", "Spring Boot", "REST APIs", "JWT", "RBAC", "MySQL", "Docker"],
      keyFeatures: [
        "Claim submission and validation",
        "Claim processing workflows",
        "Reporting workflows",
        "JWT authentication",
        "Role-Based Access Control",
      ],
      technicalImplementation: [
        "Layered architecture separating controller, service and persistence concerns",
        "REST APIs secured with JWT authentication",
        "Role-Based Access Control for workflow permissions",
        "Business validation across claim lifecycle operations",
        "Structured exception handling",
        "MySQL persistence and Docker containerization",
      ],
      challenges: [
        "Modeling claim lifecycle states and validation rules",
        "Applying role-based permissions across workflows",
        "Keeping a monolithic codebase cleanly layered",
      ],
      githubUrl: "https://github.com/ravichimkar/ClaimProcessingSystem",
      featured: false,
    },
  ],
};
