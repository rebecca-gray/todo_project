FROM node:8
# Create app directory
WORKDIR /usr/src/app
COPY . .
RUN rm -rf node_modules
RUN npm install
EXPOSE 8080
CMD [ "npm", "start" ]