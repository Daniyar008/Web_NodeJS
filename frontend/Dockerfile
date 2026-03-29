FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY frontend/package*.json ./frontend/
RUN npm ci --workspaces --include-workspace-root

COPY . .
RUN npm run build --workspace frontend

EXPOSE 5173
CMD ["npm", "run", "preview", "--workspace", "frontend", "--", "--host", "0.0.0.0", "--port", "5173"]
