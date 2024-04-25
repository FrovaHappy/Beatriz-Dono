FROM node:20

RUN mkdir -p /app

COPY . /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

CMD ["npm", "run", "bot:deploy_docker"]