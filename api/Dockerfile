FROM node:22

WORKDIR /app

COPY package.json /app/

RUN apt-get update && apt-get install -y default-mysql-client

RUN npm install

COPY . /app/
EXPOSE 5000

CMD ["./executeDBinit.sh", "trpg-mysql:3306", "--", "npm", "start"]