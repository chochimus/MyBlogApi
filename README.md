# Blog-API

This is a backend API designed to power a blog application, including functionality that will be used in conjunction with an admin dashboard and a user-facing front-end.

### Why?

The purpose of this project is to practice and refine backend development skills while creating a functional and flexible blog platform.

### Technologies Used

- **RESTful**
- **Prisma ORM(postgresql)**
- **Javascript(es6)**
- **Express**
  - express-validator
  - custom solution for json web token
  - protected routes

### QuickStart

---

#### 1. Clone the repo

```bash
git clone https://github.com/chochimus/MyBlogApi.git
cd blog-api
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set up environtment variables

you'll need to include these in a `.env` file

```bash
DATABASE_URL=your_db_url
SECRET=jwt_secret
```

#### 4. Run migrations

If using Prisma, you can apply the migrations

```bash
npx prisma migrate dev
```

#### 5. Start the server

```bash
npm start
```

## Future Improvements

- expand rate-limiting
- full testing suite
