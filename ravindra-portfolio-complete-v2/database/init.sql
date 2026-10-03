CREATE DATABASE IF NOT EXISTS portfolio;
USE portfolio;
CREATE TABLE IF NOT EXISTS users(id BIGINT AUTO_INCREMENT PRIMARY KEY,email VARCHAR(190) UNIQUE NOT NULL,password_hash VARCHAR(255) NOT NULL,full_name VARCHAR(150) NOT NULL,enabled BOOLEAN DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS roles(id BIGINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(30) UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS user_roles(user_id BIGINT,role_id BIGINT,PRIMARY KEY(user_id,role_id),FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS profile(id BIGINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(150),professional_title VARCHAR(200),location VARCHAR(200),email VARCHAR(190),summary TEXT,hero_headline VARCHAR(255),hero_description TEXT,availability VARCHAR(255),profile_image_url VARCHAR(1000),resume_url VARCHAR(1000));
CREATE TABLE IF NOT EXISTS projects(id BIGINT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(200) NOT NULL,slug VARCHAR(220) UNIQUE NOT NULL,short_description TEXT,description TEXT,architecture VARCHAR(80),technical_implementation TEXT,challenges TEXT,github_url VARCHAR(1000),live_demo_url VARCHAR(1000),thumbnail_url VARCHAR(1000),featured BOOLEAN DEFAULT FALSE,status ENUM('DRAFT','PUBLISHED','ARCHIVED') DEFAULT 'DRAFT',display_order INT DEFAULT 0,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,INDEX(status,display_order));
CREATE TABLE IF NOT EXISTS skills(id BIGINT AUTO_INCREMENT PRIMARY KEY,category VARCHAR(100),name VARCHAR(120),description VARCHAR(500),display_order INT DEFAULT 0,published BOOLEAN DEFAULT TRUE,INDEX(category,display_order));
CREATE TABLE IF NOT EXISTS experiences(id BIGINT AUTO_INCREMENT PRIMARY KEY,company VARCHAR(200),role VARCHAR(200),location VARCHAR(200),start_date DATE,end_date DATE,description TEXT,published BOOLEAN DEFAULT TRUE,display_order INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS education(id BIGINT AUTO_INCREMENT PRIMARY KEY,institution VARCHAR(250),degree VARCHAR(150),field_of_study VARCHAR(200),start_year INT,end_year INT,cgpa DECIMAL(3,2),description TEXT,published BOOLEAN DEFAULT TRUE,display_order INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS certifications(id BIGINT AUTO_INCREMENT PRIMARY KEY,name VARCHAR(250),issuer VARCHAR(200),completion_date DATE,credential_url VARCHAR(1000),description TEXT,image_url VARCHAR(1000),published BOOLEAN DEFAULT TRUE,display_order INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS achievements(id BIGINT AUTO_INCREMENT PRIMARY KEY,title VARCHAR(250),description TEXT,achievement_date DATE,url VARCHAR(1000),image_url VARCHAR(1000),published BOOLEAN DEFAULT TRUE,display_order INT DEFAULT 0);
CREATE TABLE IF NOT EXISTS social_links(id BIGINT AUTO_INCREMENT PRIMARY KEY,platform VARCHAR(80),url VARCHAR(1000),icon VARCHAR(120),display_order INT DEFAULT 0,active BOOLEAN DEFAULT TRUE);
CREATE TABLE IF NOT EXISTS contact_messages(id BIGINT AUTO_INCREMENT PRIMARY KEY,sender_name VARCHAR(150),email VARCHAR(190),subject VARCHAR(250),message TEXT,is_read BOOLEAN DEFAULT FALSE,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,INDEX(is_read,created_at));
CREATE TABLE IF NOT EXISTS site_settings(setting_key VARCHAR(120) PRIMARY KEY,setting_value TEXT,updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS activity_logs(id BIGINT AUTO_INCREMENT PRIMARY KEY,actor_email VARCHAR(190),action VARCHAR(100),entity_type VARCHAR(100),entity_id BIGINT,details TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
INSERT IGNORE INTO roles(name) VALUES('ADMIN'),('EDITOR'),('VIEWER');

INSERT INTO profile(name,professional_title,location,email,summary,hero_headline,hero_description,availability,profile_image_url,resume_url)
SELECT 'Ravindra Sopan Chimkar','Software Engineer | Java Developer','Pune, Maharashtra, India','ravichimkar2004@gmail.com',
'Software Engineer with hands-on experience in designing, developing, and building scalable backend applications using Java, Spring Boot, Microservices, REST APIs, and MySQL. Strong foundation in Object-Oriented Programming, Data Structures & Algorithms, JWT authentication, database optimization, Docker, and Git. Passionate about building secure, maintainable, and high-performance software solutions.',
'Building reliable backend systems and modern web applications.',
'Java, Spring Boot, REST APIs, MySQL and secure application design.',
'OPEN TO SOFTWARE ENGINEERING OPPORTUNITIES','/Ravi%20JPG.png','/resume/ravindra-chimkar-resume.pdf'
WHERE NOT EXISTS(SELECT 1 FROM profile);

INSERT INTO skills(category,name,description,display_order,published)
SELECT * FROM (
SELECT 'Languages','Java','Core programming languages used day to day.',1,TRUE UNION ALL
SELECT 'Languages','SQL','Core programming languages used day to day.',2,TRUE UNION ALL
SELECT 'Languages','JavaScript','Core programming languages used day to day.',3,TRUE UNION ALL
SELECT 'Backend','Spring Boot','Service design, APIs and application security.',1,TRUE UNION ALL
SELECT 'Backend','Microservices','Service design, APIs and application security.',2,TRUE UNION ALL
SELECT 'Backend','Servlets','Service design, APIs and application security.',3,TRUE UNION ALL
SELECT 'Backend','JDBC','Service design, APIs and application security.',4,TRUE UNION ALL
SELECT 'Backend','REST APIs','Service design, APIs and application security.',5,TRUE UNION ALL
SELECT 'Backend','JWT Authentication','Service design, APIs and application security.',6,TRUE UNION ALL
SELECT 'Backend','RBAC','Service design, APIs and application security.',7,TRUE UNION ALL
SELECT 'Database','MySQL','Relational modeling and query performance.',1,TRUE UNION ALL
SELECT 'Database','Query Optimization','Relational modeling and query performance.',2,TRUE UNION ALL
SELECT 'Database','Data Modeling','Relational modeling and query performance.',3,TRUE UNION ALL
SELECT 'Tools','Docker','Build, containerization and delivery workflow.',1,TRUE UNION ALL
SELECT 'Tools','Git','Build, containerization and delivery workflow.',2,TRUE UNION ALL
SELECT 'Tools','Maven','Build, containerization and delivery workflow.',3,TRUE UNION ALL
SELECT 'Tools','Postman','Build, containerization and delivery workflow.',4,TRUE UNION ALL
SELECT 'Core CS','Object-Oriented Programming (OOP)','Fundamentals behind maintainable systems.',1,TRUE UNION ALL
SELECT 'Core CS','Collections Framework','Fundamentals behind maintainable systems.',2,TRUE
) x WHERE NOT EXISTS(SELECT 1 FROM skills);

INSERT INTO education(institution,degree,field_of_study,start_year,end_year,cgpa,description)
SELECT 'Dr. D. Y. Patil Institute of Technology, Pune','Bachelor of Engineering (B.E.)','Electronics & Telecommunication Engineering',2022,2026,6.95,''
WHERE NOT EXISTS(SELECT 1 FROM education);

INSERT INTO experiences(company,role,location,start_date,end_date,description,published,display_order)
SELECT 'Wipro Limited','Java Full Stack Development','Pune, India','2025-07-01','2025-10-31',
'Industry-oriented Java Full Stack Development program covering backend application development with Java and Spring Boot, REST API design, relational databases and the surrounding engineering toolchain.',
TRUE,1 WHERE NOT EXISTS(SELECT 1 FROM experiences);

INSERT INTO projects(title,slug,short_description,description,architecture,technical_implementation,challenges,github_url,featured,status,display_order)
SELECT 'Credit Score Analysis Tool','credit-score-analysis-tool',
'A microservices-based application focused on credit data processing, credit score analysis and backend reporting.',
'A microservices-based application focused on credit data processing, credit score analysis and backend reporting. The system is split into independent services communicating over secure REST APIs, with JWT-based authentication and a MySQL data layer designed around clean data modeling and query optimization.',
'Microservices',
'Spring Boot services structured around independent business capabilities
JWT-based authentication securing service endpoints
MySQL persistence with considered data modeling
Database optimization for credit data queries
Docker containerization for consistent environments',
'Designing service boundaries for credit data processing
Securing inter-service communication with JWT
Optimizing database access for analysis workloads',
'https://github.com/ravichimkar/CreditScoreAnalysisTool',TRUE,'PUBLISHED',1
WHERE NOT EXISTS(SELECT 1 FROM projects WHERE slug='credit-score-analysis-tool');

INSERT INTO projects(title,slug,short_description,description,architecture,technical_implementation,challenges,github_url,featured,status,display_order)
SELECT 'Claims Processing System','claims-processing-system',
'A backend insurance claim management system supporting claim submission, validation, processing and reporting workflows.',
'A backend insurance claim management system supporting claim submission, validation, processing and reporting workflows. Built as a layered monolithic Spring Boot application with role-based access control, business validation and structured exception handling.',
'Monolithic',
'Layered architecture separating controller, service and persistence concerns
REST APIs secured with JWT authentication
Role-Based Access Control for workflow permissions
Business validation across claim lifecycle operations
Structured exception handling
MySQL persistence and Docker containerization',
'Modeling claim lifecycle states and validation rules
Applying role-based permissions across workflows
Keeping a monolithic codebase cleanly layered',
'https://github.com/ravichimkar/ClaimProcessingSystem',FALSE,'PUBLISHED',2
WHERE NOT EXISTS(SELECT 1 FROM projects WHERE slug='claims-processing-system');

INSERT INTO certifications(name,issuer,completion_date,credential_url,description,published,display_order)
SELECT 'Java Foundations Professional Certificate','JetBrains','2026-08-01',NULL,'Java, Data Structures, Object-Oriented Programming',TRUE,1
WHERE NOT EXISTS(SELECT 1 FROM certifications WHERE name='Java Foundations Professional Certificate');
INSERT INTO certifications(name,issuer,completion_date,credential_url,description,published,display_order)
SELECT 'Alpha — DSA with Java','Apna College',NULL,NULL,'Data Structures, Algorithms, Java',TRUE,2
WHERE NOT EXISTS(SELECT 1 FROM certifications WHERE name='Alpha — DSA with Java');
INSERT INTO certifications(name,issuer,completion_date,credential_url,description,published,display_order)
SELECT 'Wipro TalentNext — Java Full Stack','Wipro Limited','2025-10-01',NULL,'Java, Spring Boot, REST APIs, MySQL',TRUE,3
WHERE NOT EXISTS(SELECT 1 FROM certifications WHERE name='Wipro TalentNext — Java Full Stack');
INSERT INTO certifications(name,issuer,completion_date,credential_url,description,published,display_order)
SELECT 'ServiceNow Certified System Administrator (CSA)','ServiceNow','2026-02-03',NULL,'',TRUE,4
WHERE NOT EXISTS(SELECT 1 FROM certifications WHERE name='ServiceNow Certified System Administrator (CSA)');
INSERT INTO certifications(name,issuer,completion_date,credential_url,description,published,display_order)
SELECT 'ServiceNow Certified Application Developer (CAD)','ServiceNow','2026-02-02',NULL,'',TRUE,5
WHERE NOT EXISTS(SELECT 1 FROM certifications WHERE name='ServiceNow Certified Application Developer (CAD)');
INSERT INTO certifications(name,issuer,completion_date,credential_url,description,published,display_order)
SELECT 'Foundations of Data Science','Google · Coursera','2024-12-26',NULL,'',TRUE,6
WHERE NOT EXISTS(SELECT 1 FROM certifications WHERE name='Foundations of Data Science');

INSERT INTO achievements(title,description,achievement_date,url,published,display_order)
SELECT 'Secretary — ENTC Coding Club','ENTC Coding Club · Dr. D. Y. Patil Institute of Technology',NULL,NULL,TRUE,1
WHERE NOT EXISTS(SELECT 1 FROM achievements WHERE title='Secretary — ENTC Coding Club');

INSERT INTO social_links(platform,url,icon,display_order,active)
SELECT 'GitHub','https://github.com/ravichimkar','github',1,TRUE WHERE NOT EXISTS(SELECT 1 FROM social_links WHERE platform='GitHub');
INSERT INTO social_links(platform,url,icon,display_order,active)
SELECT 'LinkedIn','https://www.linkedin.com/in/ravindra-chimkar/','linkedin',2,TRUE WHERE NOT EXISTS(SELECT 1 FROM social_links WHERE platform='LinkedIn');
INSERT INTO social_links(platform,url,icon,display_order,active)
SELECT 'LeetCode','https://leetcode.com/u/ravi_chimkar/','leetcode',3,TRUE WHERE NOT EXISTS(SELECT 1 FROM social_links WHERE platform='LeetCode');
