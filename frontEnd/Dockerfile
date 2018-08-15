FROM node:8
# Create app directory
WORKDIR /usr/src/app
COPY . .
RUN rm -rf node_modules
RUN npm install
RUN npm install react-scripts@1.1.1 -g
EXPOSE 5000
CMD [ "npm", "start" ]