FROM gcr.io/distroless/java21

WORKDIR /app

COPY out/artifacts/miraculix_jar/miraculix.jar /app/app.jar

EXPOSE 1711

CMD ["app.jar"]