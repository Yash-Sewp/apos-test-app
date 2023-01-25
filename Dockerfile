FROM hellocomputerjhb/apostrophe-os:node14
RUN mkdir -p /app
WORKDIR /app
COPY . /app
EXPOSE 3000
CMD [ "npm", "start" ]