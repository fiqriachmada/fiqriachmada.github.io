# Gunakan base image resmi Node.js
FROM node:18-alpine

# Set direktori kerja
WORKDIR /app

# Copy package.json dan package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy seluruh proyek ke dalam container
COPY . .

# Build aplikasi Next.js
RUN npm run build

# Jalankan aplikasi Next.js
CMD ["npm", "run", "start"]