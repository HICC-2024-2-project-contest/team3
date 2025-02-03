FROM node:22

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/
EXPOSE 1337

CMD ["npm", "start"]
