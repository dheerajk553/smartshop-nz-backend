# SmartShop NZ — Backend + Mobile

This repository contains the SmartShop backend (Express + MongoDB) and a scaffolded Expo mobile app (`smartshop-nz-mobile`).

## Prerequisites
- Node.js 18+ and npm
- MongoDB (Atlas or local)
- For mobile: Expo CLI / Expo Go (optional)

## Backend (server)

1. Install dependencies

```bash
npm install
```

2. Create a `.env` in the repo root with your MongoDB connection string:

```
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/dbname
```

3. Run the server

```bash
node server.js
# or if you have a script: npm start
```

Available routes (see `routes/productRoutes.js`):
- `GET /products` — list products
- `GET /products/:id/prices` — get price comparison for a product
- `GET /products/:id/history` — get price history

## Mobile (Expo app)

The mobile app is in `smartshop-nz-mobile`.

1. Install dependencies

```bash
cd smartshop-nz-mobile
npm install
```

2. Configure API base

By default the mobile service uses `http://localhost:3000`. For Android emulator use `http://10.0.2.2:3000`.

- Quick option: edit `smartshop-nz-mobile/src/services/api.js` and set `apiBase`.
- Or call `setApiBase('http://10.0.2.2:3000')` in your app entry before making requests.

3. Run the app

```bash
npm start
# then open on device or emulator via Expo
```

## Screens & components added
- `smartshop-nz-mobile/src/screens/PriceComparisonScreen.js` — main comparison screen that fetches from the backend
- `smartshop-nz-mobile/src/services/api.js` — centralized API service
- `smartshop-nz-mobile/src/components/StoreTag.js` — store name + color badge

## Git
Remote is set to: `https://github.com/dheerajk553/smartshop-nz-backend` and changes have been pushed to `main`.

## Next steps (suggested)
- Wire `PriceComparisonScreen` into the app navigation (Expo Router: add a route in `src/app`)
- Add authentication or CORS config for remote device testing
- Add CI (GitHub Actions) for lint/tests

If you want, I can: wire the screen into navigation, run the app locally, or add CI workflow.
