FROM node:22
WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm install
RUN npx prisma generate --schema=./src/prisma/schema.prisma
RUN npm run build
EXPOSE 3001
CMD ["npm", "run", "start"]