FROM node:18-alpine3.14

WORKDIR /booking-management

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY prisma ./prisma/
RUN npx prisma generate
RUN yarn migrate:dev 

COPY . .

ENV PORT 5006

EXPOSE 5006

CMD ["yarn" , "dev"]