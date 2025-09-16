FROM postgres:16

ENV POSTGRES_USER=postgres

COPY ./init-scripts/ /docker-entrypoint-initdb.d/

EXPOSE 5432

