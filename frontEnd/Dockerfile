FROM node:8
# Create app directory
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install react-scripts@1.1.1 -g
COPY . .
EXPOSE 5000
CMD [ "npm", "start" ]
