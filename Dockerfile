FROM node:alpine
COPY . /council-portal-backend
WORKDIR /council-portal-backend
RUN npm i 
CMD ["sh", "scripts/runprod.sh"]