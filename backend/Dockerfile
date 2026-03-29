FROM node:20-alpine AS base
WORKDIR /app

COPY package*.json ./
COPY backend/package*.json ./backend/
RUN npm ci --workspaces --include-workspace-root

COPY . .
RUN npm run build --workspace backend

EXPOSE 4000
CMD ["npm", "run", "start", "--workspace", "backend"]
