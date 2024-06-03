FROM node:18-alpine3.14

WORKDIR /email

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY prisma ./prisma/

RUN npx prisma generate

RUN yarn migrate:dev 

COPY . .

ENV PORT 5003

EXPOSE 5003

CMD ["yarn" , "dev"]