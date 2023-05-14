FROM node

WORKDIR /shopping

COPY package.json .


RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["node", "./dist/server.js"]