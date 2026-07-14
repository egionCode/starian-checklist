FROM node:20

RUN apt-get update \
    && apt-get install -y --no-install-recommends chromium \
    && rm -rf /var/lib/apt/lists/*

ENV CHROME_BIN=/usr/bin/chromium

WORKDIR /frontend

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

ENV NG_CLI_ANALYTICS false

CMD ["npm", "run", "start", "--", "--host=0.0.0.0"]
