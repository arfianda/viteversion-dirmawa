FROM node:20-alpine
WORKDIR /app

# Ambil dependencies
COPY package*.json ./
RUN npm install

# Salin sisa file proyek
COPY . .

EXPOSE 3000

# Jalankan server development Vite
CMD ["npm", "run", "dev"]