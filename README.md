# Fixture Movies (Full MERN Project)

A simple full-stack MERN (MongoDB, Express, React, Node) project for managing movies with user authentication and poster uploads.

## Features

- **User Auth**: Register and login with JWT-based authentication.
- **Movie CRUD**: Create, read, update, and delete movie records (with ownership checks).
- **Poster Uploads**: Upload poster images (stored in `uploads/` and served from `/uploads`).
- **REST API**: Server exposes JSON endpoints under `/api/auth` and `/api/movies`.

## Tech Stack

- **Frontend**: React (in `client/`).
- **Backend**: Node.js + Express (in `server/`).
- **Database**: MongoDB (via Mongoose).
- **File Uploads**: `multer` storing files in `server/uploads/`.

## Repository Structure

```
client/
  package.json
  src/...
server/
  package.json
  server.js
  config/
    db.js
  routes/
    auth.js
    movies.js
  models/
    Movie.js
    User.js
  uploads/    # poster images stored here
```

## Prerequisites

- Node.js (v16+ recommended)
- npm (comes with Node)
- MongoDB (local or hosted URI)

## Environment Variables (server)

Create a `.env` file inside the `server/` directory with at least:

```
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Notes:
- `MONGO_URI` is required for DB connection.
- `JWT_SECRET` is used to sign auth tokens (set a strong secret for production).
- `PORT` defaults to `5001` if not set.

## Setup & Run (PowerShell)

Open two terminals (one for server, one for client).

Server (in `server/`):

```powershell
cd server
npm install
# for development with auto-reload (requires nodemon):
npm run dev
# or to run once:
npm start
```

Client (in `client/`):

```powershell
cd client
npm install
npm start
```

By default the React app runs on `http://localhost:3000` and the server on `http://localhost:5001` (or the `PORT` you set). If the client needs to call the server, update the API base URL in the client code (see `client/src/utils/api.js`).

## API Endpoints (overview)

- **Auth** (`/api/auth`)
  - `POST /register` : Register new user. Body: `{ name, email, password }`. Returns `{ token, user }`.
  - `POST /login` : Login. Body: `{ email, password }`. Returns `{ token, user }`.

- **Movies** (`/api/movies`)
  - `GET /` : Get all movies.
  - `GET /:id` : Get movie by id.
  - `POST /` : Create movie (protected). Send `multipart/form-data` with `poster` file and fields like `title`, `cast`, `releaseDate`, `director`, `producer`, `description`.
  - `PUT /:id` : Update movie (protected + owner). Can include a new `poster` file.
  - `DELETE /:id` : Delete movie (protected + owner).

Authentication: send JWT in request headers (the client code should set `Authorization: Bearer <token>`).

Uploaded posters are accessible via `/uploads/<filename>` since the server serves the `uploads` folder statically.

## Useful Notes

- The server logs `MONGO_URI` and `JWT_SECRET` at start (for debugging) — avoid doing this in production.
- File uploads are saved to `server/uploads/` and the movie records store `posterUrl` as a path like `/uploads/<file>`.
- The `movies` routes include ownership checks — only the creator can edit or delete their movie.

## Testing & Development Tips

- Use tools like Postman or Insomnia to test the API endpoints and upload files.
- For concurrent development, you can run the server with `npm run dev` (nodemon) and the client with `npm start`.

## Deployment Suggestions

- Use environment variables in your deployment platform for `MONGO_URI` and `JWT_SECRET`.
- For production static serving you can build the React app (`npm run build` in `client/`) and serve the `build` folder via a static server or configure the Express server to serve it.

## Next Steps (ideas)

- Add pagination and search for movies.
- Add user profiles and avatars.
- Add role-based permissions (admins vs regular users).

---

If you'd like, I can also:

- Add a root-level `package.json` with concurrent start scripts.
- Add a sample `.env.example` in `server/`.
- Update `client/src/utils/api.js` to use an env-configured base URL.

Enjoy — let me know if you want any of the optional extras implemented.
