FROM node

WORKDIR /shopping

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3002

CMD ["npm", "start"]