FROM jenkins/agent:alpine

USER root

RUN apk add --update nodejs npm
RUN npm install -g @angular/cli@8.3.17
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositori$
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/r$
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/rep$
    && echo "http://dl-cdn.alpinelinux.org/alpine/v3.11/main" >> /etc/apk/repos$
    && apk upgrade -U -a \
    && apk add --no-cache libstdc++ chromium harfbuzz nss freetype ttf-freefont$
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk
ENV CHROME_BIN=/usr/bin/chromium-browser CHROME_PATH=/usr/lib/chromium/

USER jenkins