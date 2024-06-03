FROM node:18-alpine3.14

WORKDIR /auth

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY prisma ./prisma/
RUN npx prisma generate
RUN yarn migrate:dev 

COPY . .

ENV PORT 5001

EXPOSE 5001

CMD ["yarn" , "dev"]