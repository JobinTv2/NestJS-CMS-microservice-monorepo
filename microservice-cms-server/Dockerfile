
FROM node:18-alpine As development

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm ci


COPY --chown=node:node . .


RUN npm run build

CMD ["node", "dist/main.js"]