
FROM node:18-alpine As development

USER node

WORKDIR /home/node

COPY --chown=node:node package*.json ./

RUN npm i


COPY --chown=node:node . .


RUN npm run build


CMD ["npm", "run", "start"]

# CMD ["node", "dist/main.js"]
