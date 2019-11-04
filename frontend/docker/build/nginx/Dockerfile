FROM nginx
COPY dev.conf /etc/nginx/conf.d/default.conf

RUN sed -e 's/^worker_processes.*/worker_processes 5;/' -i /etc/nginx/nginx.conf

EXPOSE 80