#!/bin/bash

RUN npx prisma generate
RUN npx prisma migrate deploy
RUN npm run build