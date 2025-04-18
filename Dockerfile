FROM node:latest

WORKDIR /app

COPY package*.json .

RUN npm ci

COPY . .

EXPOSE 3000

ENV adminSecretKey=admin123
ENV userSecretKey=user123

CMD ["node", "CourseSellingApp.js"]

