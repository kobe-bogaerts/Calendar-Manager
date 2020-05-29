FROM httpd:2.4
COPY ./web /usr/local/apache2/htdocs/
RUN apt update
RUN apt install -y curl
RUN curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-7.7.0-amd64.deb
RUN dpkg -i filebeat-7.7.0-amd64.deb
RUN systemctl enable filebeat
RUN filebeat modules enable system apache
COPY ./apache.yaml /etc/filebeat/modules.d/apache.yaml
COPY ./system.yaml /etc/filebeat/modules.d/system.yaml
RUN systemctl start filebeat