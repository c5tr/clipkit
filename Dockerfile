# base node image
FROM node:18-slim as base

ENV NODE_ENV production
RUN apt-get update && apt-get install -y openssl ffmpeg

FROM base as deps
WORKDIR /app
RUN npm i -g pnpm
ADD package.json ./
RUN npm install --include=dev

FROM base as production-deps
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD package.json ./
RUN npm prune --omit=dev

FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
ADD prisma .
RUN npx prisma generate
ADD . .
RUN npm run build

FROM base
ENV NODE_ENV="production"
WORKDIR /app
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma

COPY --from=build /app/build /app/build
COPY --from=build /app/public /app/public
COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/start.sh /app/start.sh
COPY --from=build /app/prisma /app/prisma
RUN chmod +x /app/start.sh
ENTRYPOINT [ "./start.sh" ]