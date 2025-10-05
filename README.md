## CornerGO Admin

Web administration application built with Quasar Framework (Vue 3 + Vite) to manage CornerGO modules: clients, sales, inventory, electronic documents, products, providers, etc.

### Technologies

- **Vue 3** with **Quasar 2** (CLI Vite)
- **Pinia** for global state
- **Vue Router 4** (history mode)
- **Axios** for HTTP and **socket.io-client** for real-time
- **Chart.js** and **jsPDF** for visualization and reports

### Requirements

- Node.js ^18 or ^20
- Yarn >= 1.21 (uses Yarn 1.x)

### Scripts

- `yarn dev`: starts Quasar development server
- `yarn build`: generates production build in `dist/`
- `yarn deploy`: deploys to Vercel (uses `@vercel/static-build`)
- `yarn up`: updates dependencies to latest compatible version
- `yarn icons`: generates PWA icons from `src/assets/icon.png`

### Environment Configuration

The backend base URL is defined in `quasar.config.js`:

- Development: `BASE_URL = http://localhost:3015`
- Production: `BASE_URL = https://cornergo-api.herokuapp.com`

This is injected into `process.env.BASE_URL` and used by `src/boot/axios.js` and `src/boot/socket.js`.

### Development Execution

1. Install dependencies
   ```bash
   yarn
   ```
2. Start local environment
   ```bash
   yarn dev
   ```
3. Backend expected at `http://localhost:3015` (configurable from `quasar.config.js`).

### Production Build

```bash
yarn build
```

Output in `dist/` (configured via `quasar.config.js`).

### Deployment (Vercel)

The `vercel.json` file uses `@vercel/static-build` reading `package.json` and serving `dist/`. Route rules:

- First tries static files
- SPA fallback: redirects `/*` to `/index.html`

Manual deployment:

```bash
yarn deploy
```

### Main Structure

- `src/boot/`: Quasar startup files
  - `vueErrors.js`: global Vue error handler
  - `axios.js`: Axios instance, interceptors and Bearer token
  - `socket.js`: `socket.io` client with `process.env.BASE_URL`
  - `pinia.js`: Pinia registration (if used)
- `src/router/`
  - `routes.js`: main layout and pages; applies auth/admin metadata
  - `index.js`: creates router and implements `beforeEach` guards
  - `loader.js`: auto-loads routes from `src/pages/**` with convention:
    - `docs.vue` or `index.vue` => `/<folder>`
    - `doc.vue` => `/<folder>/:id`
    - `create.vue` => `/<folder>/create`
- `src/stores/`: Pinia stores (auth, companies, items, etc.)
- `src/pages/`: views for each module (clients, inventory, sales...)
- `src/components/`: UI components (tables, inputs, layouts)
- `src/tools/notify.js`: Quasar Notify wrapper

### Authentication and Permissions

- Store `src/stores/auth.js` handles `login`/`logout`, user and token in `LocalStorage`
- After `login`, adds `Authorization: Bearer <token>` to Axios
- IP verification for non-admin users against `companies` whitelist
- Route guards (`src/router/index.js`):
  - Requires authentication based on `meta.requiresAuth`
  - Requires admin based on `meta.requiresAdmin`
  - Notifies and redirects using `tools/notify`

### Automatic Routing

`src/router/loader.js` scans `src/pages/**` with `import.meta.glob` and creates routes dynamically, omitting:

- `components` folders
- Files prefixed with `_` (used as internal/partials)

Names and paths are generated with the convention described in Structure.

### Key Utilities

- `tools/notify.js`: `info|positive|warning|negative` helpers
- `boot/axios.js`: `api` and `addBererToken(token)` to set header
- `boot/socket.js`: `io` from `socket.io-client` pointing to `BASE_URL`

### Main Modules (pages)

- Clients: payments, purchases and detail by id
- Inventory: general views and support components
- Sales, products, providers, emitted/received DTE, orders, transfers, etc.

### Conventions and Tips

- Use Yarn 1.x (not `npm install`)
- If you change the backend URL, modify `quasar.config.js` (`build.env.BASE_URL`)
- For PWA icons, run `yarn icons` after changing `src/assets/icon.png`

### Troubleshooting

- 401/Token errors: Axios interceptor logs out and redirects to login
- 404/Authorization: see friendly messages from `ServerErrors` in `boot/axios.js`
- Router in Vercel: see `vercel.json` for SPA fallback to `index.html`

---

© CornerGO. Quasar SPA project for administration.
