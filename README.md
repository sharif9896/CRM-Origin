# Realestate Workspace

React 19 + TypeScript frontend, Express + MongoDB API, and a shared CRM workspace.

## Run locally

Node 22+ and a running MongoDB instance are required.

1. Install dependencies: `npm --prefix backend ci` and `npm --prefix frontend ci`.
2. If you do not already have environment files, copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI`, a long random `JWT_SECRET`, and `CLIENT_URL=http://localhost:5173`. Existing environment files are preserved.
3. Optional, for a development or staging database: `npm --prefix backend run seed`. The seed adds missing login accounts and fills empty collections with the complete realistic CRM dataset. It skips populated business collections.
4. From this folder, run `npm run dev`.
5. Open http://localhost:5173. API health: http://localhost:5000/api/v1/health.

Development login accounts created by the seed:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@realestate.com` | `password123` |
| Manager | `manager@realestate.com` | `password123` |
| Senior Agent | `senior.agent@realestate.com` | `password123` |
| Agent | `jennifer@realestate.com` | `password123` |
| Staff | `staff@realestate.com` | `password123` |
| Viewer | `viewer@realestate.com` | `password123` |
| Customer | `customer@realestate.com` | `password123` |

Only administrators can create, edit, disable, delete, or assign roles to login accounts through **Staff → User Accounts**. Change all demo passwords before using the application outside local development.

The seed includes 18 listings with Unsplash cover photos and four-image galleries, remote profile photos for users, agents, staff, leads, and customers, plus linked sales, finance, appointment, review, tour, reimbursement, notification, chat, audit, role, and workspace records. Run `npm --prefix backend run seed:verify` to verify the stored counts, galleries, and database relationships. For a development or staging database that already contains older sample records, `npm --prefix backend run seed:refresh` clears the CRM collections and loads the new dataset. `seed:refresh` is destructive, so do not run it against a live database that contains records you need to retain.

On Windows PowerShell with script execution disabled, use `npm.cmd` instead of `npm`. If a frontend environment file already sets `VITE_API_BASE_URL`, that setting takes precedence over the development proxy.

## Available workflows

- Dashboard: live revenue bars and trailing average, lead-versus-visit trends, property-status donut, inventory-category bars, sales pipeline distribution, conversion, portfolio valuation, receivables, agent availability, ratings, recent listings, and operational activity. Dashboard currency and optional module links respect the signed-in user's role permissions.
- Properties: list, grid, map, details, creation, editing, deletion, categories, amenities, uploaded cover/gallery images, and editable owner/listing-agent contacts.
- CRM: agents, customers, leads, editable budget ranges and lead sources, deals with a drag-and-drop stage board, appointments, reviews and replies, and tour records.
- Finance: invoices with editable line items and retained tax rates, payments, transactions, live annual reports, CSV downloads, and printing.
- Reimbursements: administrator-managed claims, allowances, expenses, travel, food and meals, configurable types and policy limits, receipts, approval/payment statuses, recurring and taxable flags, live totals, search, sorting, pagination, CSV export, audit history, and role-based menu/action permissions.
- Administration: staff directory, separate login accounts, custom roles and permissions, organization settings, audit trail, personal profile, and password changes.
- Global search links directly to matching properties, leads, agents, and customers.
- Chat: Admin, Manager, Senior Agent, Agent, and Staff accounts have private internal messaging with live delivery, presence, unread counts, read status, and retained history. Customer and Viewer accounts receive an isolated guided assistant for properties, rentals, appointments, tours, billing, and account help.
- Visit notifications: Customer and Viewer accounts can schedule a visit from Property Details or Appointments. The server uses the authenticated account email, validates and saves the requester WhatsApp number, and automatically sends the request to the property owner and listing agent by email and WhatsApp. Administrators can filter delivery attempts, inspect provider errors, and retry failed or skipped attempts under **Notification Status**.
- Every business module includes **Manage all records**, with schema-backed create, view, edit, delete, search, server pagination, sorting, current-page CSV export, validation feedback, and deletion confirmation. Payments, transactions, roles, and user accounts open directly in this manager.
- Edit/detail sidebar links open the appropriate record list so a record can be selected instead of navigating to an invalid ID-less page.
- Role permissions are enforced by the server and reflected in the interface. Administrators retain full access and can edit the built-in Manager, Senior Agent, Agent, Viewer, Customer, and Staff roles. Under **Roles & Permissions**, separate checkbox groups control every sidebar menu/submenu and each record action. Assign a role under **Staff > User Accounts**; the navigation updates on the user's next access refresh. New public registrations become customers and cannot grant themselves administrator access.
- Property, customer, agent, and staff forms upload JPG, PNG, WebP, and GIF images directly from the device. Each image is limited to 5 MB; property galleries accept up to 10 images.
- Staff directory entries describe employees. User accounts separately control sign-in access and authorization.
- Audit entries are read-only. Dashboard and report values are derived from business records and are edited through those records.

The application is a single organization workspace. It does not implement isolated multi-tenant accounts. Currency settings describe the currency of entered amounts; changing currency does not convert historical amounts. Reports distinguish recorded ledger revenue from recorded payment receipts.

## Verification

```sh
npm run build
npm run lint
npm test
npm --prefix backend run seed:verify
npx --prefix frontend playwright install chromium
npm run test:browser
```

The integration and browser suites use uniquely named temporary databases on **local MongoDB at 127.0.0.1:27017** and clean up only their own test databases. They do not read or write the configured application database. Browser tests serve the production build on port 5001 and save desktop/mobile screenshots under `artifacts/`.

The integration suite covers CRUD, stable IDs, visit notification dispatch and delivery status, live internal chat, assistant isolation, image uploads, field validation, pagination beyond 100 records, role and sidebar permissions, linked-record deletion protection, invoice tax totals, reports, settings, profile updates, dashboard analytics, and audit records. The browser suite covers dashboard chart rendering, customer visit scheduling, admin delivery visibility, two-session real-time messaging, Viewer assistant responses, route navigation, payment create/edit/reload/delete, CSV export, settings persistence, audit visibility, record search, global search, and responsive layouts. It also writes dashboard desktop/mobile screenshots to `artifacts/`.

## Production

Run `npm run build`, then `npm start`. Express serves the built frontend and API from port 5000 (or `PORT`). Build with `VITE_API_BASE_URL=/api/v1` for same-origin hosting. Set `NODE_ENV=production`, the correct public `CLIENT_URL`, a private database URL, and a random JWT secret. Terminate HTTPS at your reverse proxy.

For the split Hostinger deployment in this repository, build the frontend with `VITE_API_BASE_URL=https://api.socailsync.com/api/v1`. Set `CLIENT_URL=https://socailsync.com` and `CLIENT_URLS=https://socailsync.com,https://www.socailsync.com` on the backend, then restart the Node application. The frontend build includes an Apache `.htaccess` fallback so direct visits and refreshes on routes such as `/login` and `/properties` load the React application.

Configure `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, and `EMAIL_FROM` in `backend/.env` for email delivery. Configure Meta WhatsApp Cloud API with `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and optionally `WHATSAPP_GRAPH_VERSION`. Without provider credentials, visit delivery attempts remain visible as **Needs setup** and can be retried after configuration; development auth emails are logged to the backend console. Property map embeds require internet access. Uploaded images are stored below `backend/uploads`; mount that directory on persistent storage and include it in production backups.

Internal chat uses authenticated Server-Sent Events at `/api/v1/chat/stream`. If a production reverse proxy is used, keep long-lived HTTP responses enabled and disable proxy buffering for this endpoint. Chat history is stored in MongoDB. Live fan-out is process-local; deployments running multiple backend instances should connect the chat event hub to shared pub/sub such as Redis.

Before public deployment, rotate any demo credentials, configure backups and monitoring, and review dependencies and access policies for your environment. This repository has not been deployed or load-tested as a production service.

