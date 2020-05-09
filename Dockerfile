FROM jenkins/agent

RUN apk add --update nodejs npm

RUN cd temp && wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && dpkg -i --force-depends google-chrome-stable_current_amd64.deb && apt-get install -f
RUN npm install -g @angular/cli@8.3.17
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" > /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
    && echo "http://dl-cdn.alpinelinux.org/alpine/v3.11/main" >> /etc/apk/repositories \
    && apk upgrade -U -a \
    && apk add --no-cache libstdc++ chromium harfbuzz nss freetype ttf-freefont \
    && rm -rf /var/cache/* \
    && mkdir /var/cache/apk
ENV CHROME_BIN=/usr/bin/chromium-browser CHROME_PATH=/usr/lib/chromium/