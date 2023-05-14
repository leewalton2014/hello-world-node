FROM node:14-alpine

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install
RUN npm run build

COPY . .

CMD ["npm", "start"]
