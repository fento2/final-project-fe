# API Endpoints Documentation

Dokumentasi ini menjelaskan semua API endpoints yang perlu dibuat di backend berdasarkan schema database Prisma.

## Base URL
```
http://localhost:3001/api
```

## Authentication Headers
```
Authorization: Bearer <token>
Cookie: access_token=<token>
```

---

## 🔐 Authentication Endpoints

### POST /auth/register
**Deskripsi**: Registrasi user baru
**Body**:
```json
{
  "username": "string",
  "email": "string", 
  "password": "string",
  "name": "string",
  "role": "USER" | "COMPANY" | "DEVELOPER"
}
```

### POST /auth/login
**Deskripsi**: Login user
**Body**:
```json
{
  "email": "string",
  "password": "string"
}
```

### POST /auth/logout
**Deskripsi**: Logout user
**Auth**: Required

### POST /auth/google
**Deskripsi**: Login dengan Google OAuth
**Body**:
```json
{
  "token": "string"
}
```

### POST /auth/forgot-password
**Deskripsi**: Kirim email reset password
**Body**:
```json
{
  "email": "string"
}
```

### POST /auth/reset-password/:token
**Deskripsi**: Reset password dengan token
**Body**:
```json
{
  "password": "string"
}
```

### POST /auth/verify-email/:token
**Deskripsi**: Verifikasi email dengan token

---

## 👤 User Management Endpoints

### GET /users/profile
**Deskripsi**: Get user profile
**Auth**: Required

### PUT /users/profile
**Deskripsi**: Update user profile
**Auth**: Required
**Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "birthDate": "ISO string",
  "gender": "MALE" | "FEMALE",
  "address": "string",
  "education": "string"
}
```

### POST /users/profile-picture
**Deskripsi**: Upload profile picture
**Auth**: Required
**Content-Type**: multipart/form-data
**Body**: FormData dengan file

---

## 🏢 Company Endpoints

### GET /companies
**Deskripsi**: Get list companies dengan filter
**Query Parameters**:
- `search`: string (optional)
- `industry`: string (optional)  
- `location`: string (optional)
- `rating`: number (optional)
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)

### GET /companies/:id
**Deskripsi**: Get company detail by ID

### GET /companies/top
**Deskripsi**: Get top companies
**Query Parameters**:
- `limit`: number (optional, default: 10)

### POST /companies
**Deskripsi**: Create new company
**Auth**: Required (COMPANY role)
**Body**:
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "description": "string",
  "website": "string"
}
```

### PUT /companies/:id
**Deskripsi**: Update company
**Auth**: Required (COMPANY role)

### POST /companies/:id/logo
**Deskripsi**: Upload company logo
**Auth**: Required (COMPANY role)
**Content-Type**: multipart/form-data

---

## 💼 Job Endpoints

### GET /jobs
**Deskripsi**: Get list jobs dengan filter
**Query Parameters**:
- `search`: string (optional)
- `category`: Category enum (optional)
- `location`: string (optional)
- `jobType`: JobType enum (optional)
- `salaryMin`: number (optional)
- `salaryMax`: number (optional)
- `page`: number (optional)
- `limit`: number (optional)

### GET /jobs/:id
**Deskripsi**: Get job detail by ID

### GET /jobs/slug/:slug
**Deskripsi**: Get job detail by slug

### GET /jobs/featured
**Deskripsi**: Get featured jobs
**Query Parameters**:
- `limit`: number (optional, default: 6)

### GET /jobs/company/:companyId
**Deskripsi**: Get jobs by company ID

### POST /jobs
**Deskripsi**: Create new job
**Auth**: Required (COMPANY role)
**Body**:
```json
{
  "title": "string",
  "description": "string",
  "category": "Category enum",
  "location": "string",
  "latitude": "string",
  "longitude": "string",
  "salary": "number",
  "periodSalary": "PeriodSalary enum",
  "currency": "Currency enum",
  "job_type": "JobType enum",
  "expiredAt": "ISO string",
  "skills": ["string"],
  "preselection_test": "boolean"
}
```

### PUT /jobs/:id
**Deskripsi**: Update job
**Auth**: Required (COMPANY role)

### DELETE /jobs/:id
**Deskripsi**: Delete job (soft delete)
**Auth**: Required (COMPANY role)

---

## 💾 Job Save Endpoints

### GET /job-saves
**Deskripsi**: Get saved jobs untuk user
**Auth**: Required (USER role)

### POST /job-saves
**Deskripsi**: Save job
**Auth**: Required (USER role)
**Body**:
```json
{
  "job_id": "number"
}
```

### DELETE /job-saves/:jobId
**Deskripsi**: Unsave job
**Auth**: Required (USER role)

---

## 📝 Application Endpoints

### GET /applications/my
**Deskripsi**: Get my applications
**Auth**: Required (USER role)

### GET /applications/company
**Deskripsi**: Get applications untuk company
**Auth**: Required (COMPANY role)
**Query Parameters**:
- `jobId`: number (optional)

### GET /applications/:id
**Deskripsi**: Get application detail

### POST /applications
**Deskripsi**: Apply for job
**Auth**: Required (USER role)
**Body**:
```json
{
  "job_id": "number",
  "expected_salary": "number",
  "cv": "string (file path)"
}
```

### PUT /applications/:id/status
**Deskripsi**: Update application status
**Auth**: Required (COMPANY role)
**Body**:
```json
{
  "status": "Status enum"
}
```

### POST /applications/upload-cv
**Deskripsi**: Upload CV file
**Auth**: Required (USER role)
**Content-Type**: multipart/form-data

---

## 🎓 Education Endpoints

### GET /educations
**Deskripsi**: Get user educations
**Auth**: Required (USER role)

### POST /educations
**Deskripsi**: Create education
**Auth**: Required (USER role)
**Body**:
```json
{
  "university": "string",
  "degree": "string", 
  "fieldOfStudy": "string",
  "startDate": "ISO string",
  "endDate": "ISO string",
  "description": "string"
}
```

### PUT /educations/:id
**Deskripsi**: Update education
**Auth**: Required (USER role)

### DELETE /educations/:id
**Deskripsi**: Delete education
**Auth**: Required (USER role)

---

## 💼 Experience Endpoints

### GET /experiences
**Deskripsi**: Get user experiences
**Auth**: Required (USER role)

### POST /experiences
**Deskripsi**: Create experience
**Auth**: Required (USER role)
**Body**:
```json
{
  "name": "string",
  "position": "string",
  "startDate": "ISO string", 
  "endDate": "ISO string",
  "description": "string"
}
```

### PUT /experiences/:id
**Deskripsi**: Update experience
**Auth**: Required (USER role)

### DELETE /experiences/:id
**Deskripsi**: Delete experience  
**Auth**: Required (USER role)

---

## 🧠 Skill Assessment Endpoints

### GET /skill-assessments
**Deskripsi**: Get available skill assessments

### GET /skill-assessments/:id
**Deskripsi**: Get skill assessment detail dengan questions

### POST /skill-assessments/:id/take
**Deskripsi**: Take skill assessment
**Auth**: Required (USER role)
**Body**:
```json
{
  "answers": [
    {
      "question_id": "number",
      "selected_option": "A|B|C|D"
    }
  ]
}
```

### GET /user-assessments
**Deskripsi**: Get user taken assessments
**Auth**: Required (USER role)

### GET /user-assessments/:id/certificate
**Deskripsi**: Get assessment certificate
**Auth**: Required (USER role)

---

## 📅 Interview Endpoints

### GET /interviews
**Deskripsi**: Get interviews (user: sebagai candidate, company: sebagai interviewer)
**Auth**: Required

### POST /interviews
**Deskripsi**: Schedule interview
**Auth**: Required (COMPANY role)
**Body**:
```json
{
  "application_id": "number",
  "schedule": "ISO string"
}
```

### PUT /interviews/:id
**Deskripsi**: Update interview schedule
**Auth**: Required (COMPANY role)
**Body**:
```json
{
  "schedule": "ISO string"
}
```

---

## 🧪 Selection Test Endpoints

### POST /selections
**Deskripsi**: Create selection test untuk job
**Auth**: Required (COMPANY role)
**Body**:
```json
{
  "job_id": "number",
  "passingScore": "number",
  "questions": [
    {
      "question": "string",
      "option_A": "string",
      "option_B": "string", 
      "option_C": "string",
      "option_D": "string",
      "correct_option": "A|B|C|D"
    }
  ]
}
```

### POST /selections/:jobId/take
**Deskripsi**: Take selection test
**Auth**: Required (USER role)
**Body**:
```json
{
  "answers": [
    {
      "question_id": "number",
      "selected_option": "A|B|C|D"
    }
  ]
}
```

### GET /selections/:jobId/result
**Deskripsi**: Get selection test result
**Auth**: Required

---

## 💳 Subscription Endpoints

### GET /subscriptions
**Deskripsi**: Get available subscription plans

### POST /user-subscriptions
**Deskripsi**: Subscribe user
**Auth**: Required (USER role)
**Body**:
```json
{
  "subscription_id": "number",
  "end_date": "ISO string"
}
```

### GET /user-subscriptions/current
**Deskripsi**: Get current user subscription
**Auth**: Required (USER role)

---

## ⭐ Review Endpoints

### POST /reviews
**Deskripsi**: Create company review
**Auth**: Required (USER role)
**Body**:
```json
{
  "user_company_id": "number",
  "salary_estimate": "number",
  "rating_culture": "number (1-5)",
  "rating_work_life_balance": "number (1-5)",
  "rating_facilities": "number (1-5)", 
  "rating_career": "number (1-5)"
}
```

### GET /reviews/company/:companyId
**Deskripsi**: Get company reviews

---

## 🔧 Skills Endpoints

### GET /skills
**Deskripsi**: Get all available skills

### POST /skills
**Deskripsi**: Create new skill
**Auth**: Required (DEVELOPER role)
**Body**:
```json
{
  "name": "string"
}
```

---

## 📊 Statistics Endpoints

### GET /stats/dashboard
**Deskripsi**: Get dashboard statistics
**Auth**: Required (DEVELOPER role)

### GET /stats/company
**Deskripsi**: Get company statistics
**Auth**: Required (COMPANY role)

### GET /stats/public
**Deskripsi**: Get public statistics (untuk homepage)

---

## 📁 File Upload Endpoints

### POST /upload/profile-picture
**Content-Type**: multipart/form-data
**Max Size**: 5MB
**Formats**: jpg, jpeg, png, webp

### POST /upload/company-logo
**Content-Type**: multipart/form-data
**Max Size**: 2MB
**Formats**: jpg, jpeg, png, webp, svg

### POST /upload/cv
**Content-Type**: multipart/form-data
**Max Size**: 10MB
**Formats**: pdf, doc, docx

---

## 🔄 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

### Paginated Response
```json
{
  "success": true,
  "message": "Success message", 
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

---

## 🔑 Authentication Flow

1. **Register/Login** → Dapatkan JWT token
2. **Set Cookie** → `access_token=jwt_token; HttpOnly; Secure`
3. **Middleware** → Verifikasi token di setiap protected route
4. **Refresh Token** → Implementasi refresh token untuk keamanan

---

## 📝 Database Relations

Pastikan backend menghandle relasi dengan benar:

- **User** → hasOne Profile, hasMany Education/Experience
- **Company** → belongsTo User, hasMany Jobs  
- **Job** → belongsTo Company, hasMany Applications
- **Application** → belongsTo User & Job, hasOne Interview
- **Selection** → belongsTo Job & User, hasMany SelectionQuestions

---

## 🚀 Implementation Priority

### Phase 1 (Core Features)
1. Authentication endpoints
2. User profile endpoints
3. Company endpoints
4. Job endpoints
5. Application endpoints

### Phase 2 (Additional Features)  
1. Education/Experience endpoints
2. Job save endpoints
3. Interview endpoints
4. File upload endpoints

### Phase 3 (Advanced Features)
1. Skill assessment endpoints
2. Selection test endpoints
3. Subscription endpoints
4. Review endpoints
5. Statistics endpoints
