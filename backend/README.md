# React CRM Backend

A complete Node.js + Express + MongoDB (Mongoose) backend for the React CRM
(real-estate) frontend. Every module in the frontend (`src/data/*.ts`) has a
matching MongoDB model, full CRUD REST API, search/filter/pagination, and
JWT authentication.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (httpOnly cookie or Bearer token)
- bcryptjs for password hashing
- helmet, cors, express-mongo-sanitize, express-rate-limit for security

## Folder structure

```
backend/
├── server.js                # entry point
├── package.json
├── .env.example
└── src/
    ├── app.js                # express app (middleware + routes)
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── models/                # one Mongoose model per entity
    │   ├── User.js
    │   ├── Lead.js
    │   ├── Property.js
    │   ├── Agent.js
    │   ├── Customer.js
    │   ├── Deal.js
    │   ├── Invoice.js
    │   ├── Payment.js
    │   ├── Appointment.js
    │   ├── Staff.js
    │   ├── Review.js
    │   ├── Taxonomy.js
    │   ├── Tour.js
    │   ├── Transaction.js
    │   └── Notification.js
    ├── controllers/
    │   ├── factory.js           # generic CRUD logic reused by every entity
    │   ├── authController.js
    │   ├── dashboardController.js
    │   └── notificationController.js
    ├── routes/
    │   ├── index.js             # mounts everything under /api/v1
    │   ├── buildCrudRouter.js   # generic REST router builder
    │   ├── authRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── notificationRoutes.js
    │   └── <entity>Routes.js    # one per entity (leads, properties, ...)
    ├── middleware/
    │   ├── auth.js              # protect() + authorize()
    │   ├── asyncHandler.js
    │   ├── errorHandler.js
    │   └── notFound.js
    ├── utils/
    │   ├── ApiError.js
    │   └── sendEmail.js
    └── seed/
        ├── dataset.js           # single source for realistic seed records
        ├── seed.js              # database importer and relationship linker
        ├── verify.js            # read-only seed integrity check
        └── export-json.js       # generates seed-data/*.json
```

## 1. Install MongoDB

Pick one:

- **Local install**: https://www.mongodb.com/docs/manual/installation/ then run `mongod`.
- **Docker**: `docker run -d -p 27017:27017 --name mongo mongo:7`
- **MongoDB Atlas** (free cloud cluster): https://www.mongodb.com/cloud/atlas — copy the connection string.

## 2. Configure environment variables

```bash
cd backend
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/react_crm
JWT_SECRET=some_long_random_string
CLIENT_URL=http://localhost:5173
```

## 3. Install dependencies & run

```bash
npm install
npm run dev        # starts with nodemon on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/v1/health`

## 4. Seed the full CRM dataset

The realistic seed is the single data source for both the Mongoose importer and
the checked-in JSON exports. It includes 18 properties with Unsplash covers and
four-image galleries, seven role-based login accounts, profile images, and
linked records across CRM, sales, finance, appointments, tours, reviews,
reimbursements, notifications, chat, audit history, and workspace settings.

**Option A — recommended: run the seed script**

```bash
npm run seed            # fills empty collections and preserves existing records
npm run seed:verify     # checks counts, galleries, and linked database records
npm run seed:refresh    # clears CRM collections, then loads the current dataset
npm run seed:destroy    # clears all CRM collections
```

`seed:refresh` and `seed:destroy` are destructive. Use them only for a
development or staging database whose existing records can be removed.

The seed creates these login accounts, all with password `password123`:

```
admin         -> admin@realestate.com
manager       -> manager@realestate.com
senior-agent  -> senior.agent@realestate.com
agent         -> jennifer@realestate.com
staff         -> staff@realestate.com
viewer        -> viewer@realestate.com
customer      -> customer@realestate.com
```

Change these passwords before exposing the application outside development.

**Option B — import raw JSON files with `mongoimport` / Compass**

The same dataset is also included as ready-to-import JSON files in
`backend/seed-data/*.json` (one file per collection, already generated). Import
each with `mongoimport`, e.g.:

```bash
mongoimport --uri "mongodb://127.0.0.1:27017/react_crm" \
  --collection leads --file seed-data/leads.json --jsonArray

mongoimport --uri "mongodb://127.0.0.1:27017/react_crm" \
  --collection properties --file seed-data/properties.json --jsonArray

# ...repeat for: agents, customers, deals, invoices, payments,
# appointments, staff, reviews, taxonomies, tours, transactions, notifications
```

Or drag-and-drop each `.json` file into the matching collection in
**MongoDB Compass** (Collection → Add Data → Import File → JSON).

Dates in these files use MongoDB Extended JSON (`{ "$date": "..." }`), so
`mongoimport`/Compass will store them as real `Date` fields, not strings.

⚠️ **`users.json` contains plaintext demo passwords** (hashing normally
happens in a Mongoose pre-save hook, which a raw JSON import skips). Prefer
`npm run seed` for the `users` collection — or hash the password yourself
(bcrypt, 12 rounds) before importing `users.json` directly.

If you ever change the seed data in `src/seed/dataset.js` and want to
regenerate the JSON files, run:

```bash
npm run seed:export-json
```

## 5. Connect the React frontend

In the `react/` frontend, create a `.env` (or `.env.local`) with:

```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Then use it in your API calls, e.g. with `fetch` or `axios`:

```ts
const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/leads`, {
  headers: { Authorization: `Bearer ${token}` },
});
```

Make sure `CLIENT_URL` in the backend `.env` matches the frontend's dev URL
(default `http://localhost:5173`) so CORS allows requests.

## API Reference

All routes are prefixed with `/api/v1`. All entity routes below require an
`Authorization: Bearer <token>` header (or the `token` cookie set at login).

### Auth — `/api/v1/auth`

| Method | Route                        | Description                         |
|--------|------------------------------|--------------------------------------|
| POST   | `/register`                  | Register a new user                  |
| POST   | `/login`                     | Login, returns JWT + sets cookie     |
| GET    | `/logout`                    | Clear auth cookie                    |
| GET    | `/me`                        | Get current logged-in user           |
| PUT    | `/update-profile`            | Update name/phone/avatar             |
| PUT    | `/update-password`           | Change password                      |
| POST   | `/forgot-password`           | Request password reset email         |
| PUT    | `/reset-password/:token`     | Reset password with token            |
| GET    | `/verify-email/:token`       | Verify email with token              |
| POST   | `/resend-verify-email`       | Resend verification email            |

### Dashboard — `/api/v1/dashboard`

| Method | Route                  | Description                                     |
|--------|------------------------|--------------------------------------------------|
| GET    | `/summary`             | KPI counters (leads, deals, revenue, ratings...) |
| GET    | `/revenue-overview`    | Monthly revenue (from won deals)                |
| GET    | `/property-status`     | Property counts grouped by status               |
| GET    | `/property-categories` | Property counts grouped by type                 |
| GET    | `/sales-pipeline`      | Deal counts/value grouped by stage              |
| GET    | `/featured-listings`   | Most recently added properties                  |
| GET    | `/recent-activity`     | Merged recent leads/deals/appointments feed     |

### Notifications — `/api/v1/notifications`

| Method | Route            | Description                        |
|--------|------------------|-------------------------------------|
| GET    | `/`              | List current user's notifications  |
| POST   | `/`              | Create a notification              |
| PUT    | `/read-all`      | Mark all as read                   |
| PUT    | `/:id/read`      | Mark one as read                   |
| DELETE | `/:id`           | Delete a notification              |

### Every other entity (same shape for each)

`leads`, `properties`, `agents`, `customers`, `deals`, `invoices`,
`payments`, `appointments`, `staff`, `reviews`, `taxonomies`, `tours`,
`transactions` — each exposes the full CRUD REST pattern below, e.g. for
`leads`:

| Method | Route              | Description                                                        |
|--------|--------------------|----------------------------------------------------------------------|
| GET    | `/leads`           | List, with `?page=&limit=&sort=&search=&status=Hot` etc.            |
| POST   | `/leads`           | Create                                                                |
| DELETE | `/leads`           | Bulk delete — body `{ "ids": ["...", "..."] }`                       |
| GET    | `/leads/:id`       | Get one                                                               |
| PUT    | `/leads/:id`       | Update                                                                |
| DELETE | `/leads/:id`       | Delete                                                                |

Query parameters supported on every list endpoint:

- `page`, `limit` — pagination (default page=1, limit=20, max limit=100)
- `sort` — Mongoose sort string, e.g. `sort=-createdAt` or `sort=price`
- `search` — free-text search across each entity's key text fields
- `fields` — comma-separated field selection, e.g. `fields=name,email`
- any other field name — exact-match filter, e.g. `?status=Active&type=Villa`

### Example requests

```bash
# Register
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe","email":"jane@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@realestate.com","password":"password123"}'

# List leads (with token)
curl http://localhost:5000/api/v1/leads?status=Hot&page=1&limit=10 \
  -H "Authorization: Bearer <TOKEN>"

# Create a property
curl -X POST http://localhost:5000/api/v1/properties \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ocean View Villa","location":"Malibu, CA","type":"Villa","price":4200000,"beds":4,"baths":3,"sqft":2600,"status":"For Sale"}'
```

## Notes

- Role-based access: `buildCrudRouter(Model, { writeRoles: ["admin","manager"] })`
  can be added per-entity route file to restrict create/update/delete to
  specific roles (currently every authenticated user can write — adjust as
  needed for your access model).
- Email sending (`src/utils/sendEmail.js`) falls back to console logging if
  `SMTP_HOST`/`SMTP_USER` aren't set in `.env`, so registration and
  forgot-password flows work out of the box in development.
- All list endpoints return: `{ success, count, total, page, pages, data }`.
- All errors return: `{ success: false, message }`.
