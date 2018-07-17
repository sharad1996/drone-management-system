FROM node:8
WORKDIR /realtime-geolocation-demo
COPY package.json /realtime-geolocation-demo
RUN npm install
COPY . /realtime-geolocation-demo
CMD node server.js
EXPOSE 8080
