FROM node:18-alpine

WORKDIR /api-gateway

COPY package.json yarn.lock ./


RUN yarn install --frozen-lockfile

COPY . .

ENV PORT 8081

EXPOSE 8081

CMD ["yarn" , "dev"]