FROM node:18 as build

WORKDIR /usr/src/app
COPY package.json .

COPY . .
RUN npm install

COPY /prisma ./prisma
RUN npx prisma generate
RUN npm run build

FROM node:18-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/package-lock.json .
COPY --from=build /usr/src/app/prisma ./prisma

RUN npm install --omit=dev

ENV NODE_ENV production
EXPOSE 3000
# CMD ["dumb-init", "node", "dist/src/main", ]
CMD ["npm", "run", "start:migrate:prod"]