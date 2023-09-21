# syntax=docker/dockerfile:1

FROM rust:1.72.0 AS build

WORKDIR /app

COPY . .

RUN --mount=type=cache,target=/var/cache/cargo cargo build --release

FROM debian:bookworm-slim

ARG ENV
ENV ENV=${ENV}

WORKDIR /app

COPY --from=build /app/target/release/backend .
COPY --from=build /app/.env.${ENV} .env.${ENV}

CMD ["./backend"]
