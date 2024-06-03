FROM node:18-alpine3.14

WORKDIR /hotel

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile
COPY prisma ./prisma/
RUN npx prisma generate
RUN yarn migrate:dev 

COPY . .

ENV PORT 5004

EXPOSE 5004

CMD ["yarn" , "dev"]