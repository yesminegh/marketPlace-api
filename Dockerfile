FROM node:16.13.1

WORKDIR /app
COPY ./package.json ./
COPY . ./
RUN npm i
EXPOSE 3005
CMD ["npm", "run", "start:staging"]
