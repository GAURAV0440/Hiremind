# HIREMIND frontend

React client for the existing FastAPI interview service.

## Run locally

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`. Set `VITE_API_BASE_URL` in `.env` if the FastAPI service is not available at `http://localhost:8000/api/v1`.

## Checks

```bash
npm run lint
npm run build
```
