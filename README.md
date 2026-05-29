# Diamond Square

Diamond Square is a production-ready MERN residential society management application for real committee members and residents. It includes database-backed role-based access control, OTP registration with admin approval, flat privacy, maintenance tracking, notices, complaints, contacts, and reminder notifications.

## Stack

- Backend: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt, Helmet, CORS
- Frontend: React, responsive SaaS-style CSS
- Auth: phone/email login, OTP-backed registration, encrypted passwords, JWT bearer sessions, admin approval before activation

## Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run create-admin
npm start
```

Required backend environment variables:

```bash
MONGO_URL=mongodb://127.0.0.1:27017/diamond-square
JWT_SECRET=replace-with-a-long-random-secret
CORS_ORIGIN=http://localhost:3000
PORT=5000
ADMIN_NAME=Committee Admin
ADMIN_EMAIL=admin@diamondsquare.local
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=change-this-password
```

`npm run create-admin` creates or updates the first committee admin. Residents can register only after an admin has created their flat record. In non-production mode the OTP endpoint returns the OTP in the response so local deployments can be tested without an SMS/email provider; in production, connect the OTP response point to your SMS/email delivery provider.

### Frontend

```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000 npm start
```


## Troubleshooting login stuck on “Please wait…”

The frontend calls the backend configured by `REACT_APP_API_URL` and now stops waiting after 15 seconds with a clear connection error. If login remains on “Please wait…” or shows a backend connection message:

1. Start MongoDB and the backend first: `cd backend && npm start`.
2. Confirm the API is healthy by opening `http://localhost:5000/api/health`.
3. Start the frontend with the same API base URL: `REACT_APP_API_URL=http://localhost:5000 npm start`.
4. If deployed, set `REACT_APP_API_URL` to the deployed backend URL and set backend `CORS_ORIGIN` to the deployed frontend URL.

## Core workflows

1. Admin signs in using the bootstrapped account.
2. Admin creates flat records with monthly maintenance amounts.
3. Resident requests OTP and registers against an existing flat.
4. Admin approves the resident account.
5. Admin generates monthly maintenance, posts notices, manages complaints, and maintains important contacts.
6. Residents can only view their own flat and dues, see all notices and contacts, raise complaints, and track complaint status.

## API summary

All protected routes use `Authorization: Bearer <jwt>`.

- `POST /api/auth/request-otp`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/admin/dashboard`
- `GET /api/admin/pending-users`
- `PATCH /api/admin/users/:id/approve`
- `GET|POST /api/flats`
- `GET /api/maintenance`
- `POST /api/maintenance/generate`
- `PATCH /api/maintenance/:id/mark-paid`
- `GET|POST /api/notices`
- `GET|POST /api/complaints`
- `PATCH /api/complaints/:id/status`
- `GET|POST /api/contacts`
- `GET /api/notifications`
