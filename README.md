# Health Diary BE (Week 4/5 + Authentication)

## Run

```powershell
npm install
npm run dev
```

Server: `http://127.0.0.1:3000`

## Environment

This project uses `.env` (gitignored). Required for authentication:

- `JWT_SECRET` = long random string

## Authentication (JWT)

### POST /api/auth/login

Request body:

```json
{ "username": "johndoe", "password": "password1" }
```

Response:

- `token` (JWT)
- `user` (public user object)
- `message`

### GET /api/auth/me

Requires header:

`Authorization: Bearer <token>`

Returns decoded token payload.

## Authorization rules

- `PUT /api/users/:id` is **protected**: user can update **only their own** user (token `userId` must match `:id`).
- `GET /api/entries` is **protected**: returns **only logged-in user's** entries.
- `GET /api/entries/:id`, `PUT /api/entries/:id`, `DELETE /api/entries/:id` are **protected**: only entry owner can access/modify/delete.

## Notes

- Data is in-memory (arrays in `src/users.js`, `src/entries.js`, `src/items.js`). Restarting the server resets data.
- Passwords are stored as bcrypt hashes (seed users and new users).
