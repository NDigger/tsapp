ARG NODE_VERSION=22.14.0

FROM node:${NODE_VERSION}

WORKDIR /app/frontend

COPY package.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD [ "npx", "vite", "--host"]