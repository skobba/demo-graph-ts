FROM node:12 AS build

WORKDIR /app
COPY package.json ./
RUN npm i

COPY tsconfig.json .
COPY src ./src

RUN npm run build
#we will copy node modules later, so they need to be pruned first
RUN npm prune --production


#FINAL CONTAINER
FROM node:12-alpine

ENV TZ=Europe/Oslo
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY --from=build /app/package.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

CMD ["npm", "run", "prod"]
