FROM node:18-alpine3.14

WORKDIR /user

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY prisma ./prisma/
RUN npx prisma generate
RUN yarn migrate:dev 

COPY . .

ENV PORT 5002

EXPOSE 5002

CMD ["yarn" , "dev"]