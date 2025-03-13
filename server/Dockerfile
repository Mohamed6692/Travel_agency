FROM node:alpine

WORKDIR '/app'

COPY package*.json  .

# ✅ Installation de Python et des outils nécessaires
 RUN apk add --no-cache python3 make g++

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 5000

CMD ["yarn", "start"]
