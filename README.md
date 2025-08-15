# Job Portal RESTful Backend

Secure RESTful API that lets **companies** post jobs and **candidates** search/apply.

## Stack
- Node.js, Express.js
- MongoDB, Mongoose
- JWT authentication
- Role-based access control (company, candidate)
- express-validator, centralized error handling
- Tested with Postman

## Quick Start

```bash
# 1) Install deps
npm install

# 2) Create .env from example
cp .env.example .env

# 3) Run MongoDB locally or set MONGO_URI to your cluster
# 4) Dev run
npm run dev
```

## Environment

```
MONGO_URI=mongodb://localhost:27017/job_portal
JWT_SECRET=supersecretjwt
PORT=4000
NODE_ENV=development
```

## API Overview

### Auth
- `POST /api/auth/register` { name, email, password, role: 'company'|'candidate' }
- `POST /api/auth/login` { email, password }

### Jobs
- `GET /api/jobs` public list/search `?q=&location=&skills=js,react`
- `GET /api/jobs/:id` public job details
- `POST /api/jobs` (company) create
- `PATCH /api/jobs/:id` (company owner) update
- `DELETE /api/jobs/:id` (company owner) delete

### Applications
- `POST /api/applications/jobs/:jobId/apply` (candidate) apply
- `GET /api/applications/me` (candidate) my applications
- `GET /api/applications/job/:jobId` (company owner) view applications
- `PATCH /api/applications/:id/status` (company owner) update status

## Testing with Postman

Import `postman/Job-Portal.postman_collection.json` and set an **`{{baseUrl}}`** environment variable (e.g., `http://localhost:4000`).

1. Register a company and a candidate.
2. Login as company, copy token to Postman `Authorization: Bearer <token>`.
3. Create a job.
4. Login as candidate and call **apply** endpoint.
5. Switch back to company token and list applications for that job.

## Notes
- Duplicate applications are prevented per (job, candidate).
- Only the owning company can edit/delete its jobs or change application statuses.
- Public search supports `q` full-text, `location` regex, and `skills` match any.

MIT License