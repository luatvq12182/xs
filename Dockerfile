FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6262

# Start the application
CMD ["npm", "run", "start:prod"]