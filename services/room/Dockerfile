FROM node:18-alpine3.14

WORKDIR /room

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY prisma ./prisma/
RUN npx prisma generate
RUN yarn migrate:dev 

COPY . .

ENV PORT 5005

EXPOSE 5005

CMD ["yarn" , "dev"]