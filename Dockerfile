FROM docker.klnsdr.com/nyx-cli:1.1 as builder

WORKDIR /app

COPY . .

RUN nyx build

FROM gcr.io/distroless/java21

WORKDIR /app

COPY --from=builder /app/build/miraculix-0.0.jar /app/app.jar

EXPOSE 1711

CMD ["app.jar"]