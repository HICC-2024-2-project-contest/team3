FROM node:22

WORKDIR /app

COPY package.json /app/

RUN apt-get update && apt-get install -y default-mysql-client

RUN npm install

COPY . /app/
EXPOSE 1337

CMD ["bash", "./executeDBinit.sh", "trpg-mysql:3306", "--", "npm", "start"]