FROM httpd:2.4
COPY ./web /usr/local/apache2/htdocs/
RUN apt update
RUN apt install -y curl
RUN curl -L -O -k https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.7.0-amd64.deb
RUN dpkg -i filebeat-7.7.0-amd64.deb
RUN filebeat modules enable system apache
COPY ./apache.yml /etc/filebeat/modules.d/apache.yml
COPY ./system.yml /etc/filebeat/modules.d/system.yml
COPY ./filebeat.yml /etc/filebeat/filebeat.yml
CMD ["filebeat run"]