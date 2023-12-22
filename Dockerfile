# FROM node:18 as build

# WORKDIR /usr/src/app
# COPY package.json .

# COPY . .
# RUN npm install

# COPY /prisma ./prisma
# RUN npx prisma generate
# RUN npm run build

# FROM node:18-slim
# RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends
# WORKDIR /usr/src/app
# COPY --from=build /usr/src/app/dist ./dist
# COPY --from=build /usr/src/app/package.json .
# COPY --from=build /usr/src/app/package-lock.json .
# COPY --from=build /usr/src/app/prisma ./prisma

# RUN npm install --omit=dev

# ENV NODE_ENV production
# EXPOSE 3000
# # CMD ["dumb-init", "node", "dist/src/main", ]
# CMD ["npm", "run", "start:migrate:prod"]

# Installs Node.js image
FROM node:20

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/app

# COPY package.json and package-lock.json files
COPY package*.json ./

# generated prisma files
COPY prisma ./prisma/

# COPY tsconfig.json file
COPY tsconfig.json ./

# COPY
COPY . .

# Installs all packages
RUN npm install

# Run Prisma generate after copying necessary files
RUN npx prisma generate

RUN npm run build

RUN npx prisma migrate deploy

# Runs the dev npm script to build & start the server
CMD npm run start
