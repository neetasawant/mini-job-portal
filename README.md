# Mini HR Job Board with Resume Parsing

## Overview
This project is a Mini HR Job Board that allows recruiters to post jobs and candidates to apply by uploading their resumes. The application features resume parsing to extract key details like name, email, phone number, and skills.

[![Watch the Demo](https://i.vimeocdn.com/video/1063632049)](https://vimeo.com/1063632049)


## Tech Stack
- **Frontend:** Next.js, Tailwind CSS
- **Backend:** Express.js, Node.js
- **Database:** MongoDB

## Resume Parsing
- Uses **pdf-parse** for PDFs
- Uses **mammoth** for .docx
- Uses **word-extractor** for .doc
- Extracts **Name, Email, Phone, and Skills** from resumes

## Features

### Candidate Features
- View job list
- Register & Login
- Upload a resume while applying for a job
- Automatic extraction of details from resumes
- View applied jobs and application status

### Recruiter Features
- Register & Login
- Post job listings
- Edit job listings
- Delete job listings
- View job applications along with parsed resume details
- Update application status

## Installation

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/neetasawant/mini-job-portal.git
   cd mini-job-portal/backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the backend directory and add:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm run dev
   ```
4. Open the application in a browser:
   - **URL:** [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Login a user

### Job Management
- `POST /api/jobs` - Create a job (Recruiter only)
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/:id` - Get job by ID
- `PUT /api/jobs/:id` - Update job by ID
- `DELETE /api/jobs/:id` - Delete job by ID
- `GET /api/jobs/recruiter/jobs` - Get jobs by recruiter

### Application Management
- `POST /api/applications` - Apply for a job (with resume upload)
- `GET /api/applications/recruiter` - View recruiter’s job applications
- `GET /api/applications/candidate` - View candidate’s applications
- `PUT /api/applications/:id/status` - Update application status

## Future Enhancements
- Improved resume parsing with AI
- Job search and filtering
- Email notifications

