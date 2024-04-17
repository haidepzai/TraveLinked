# Stage 1
FROM node:14 AS client_build

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .

RUN npm install 

RUN npm run build

# Stage 2
FROM nginx:latest

COPY --from=client_build /usr/src/app/dist/city-tours-frontend /usr/share/nginx/html

COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80