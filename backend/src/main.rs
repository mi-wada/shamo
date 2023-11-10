use std::{env, str::FromStr};

use axum::{
    extract::MatchedPath,
    http::{header::CONTENT_TYPE, Request},
    routing::{delete, get, post, put},
    Router,
};
use handler::{health, rooms, users};
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};
use tower_http::{
    cors::{self, CorsLayer},
    trace::TraceLayer,
};
use tracing::info_span;
use tracing_subscriber::{prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    let app_env = env::var("ENV").expect("ENV not set");

    dotenvy::from_filename(format!(".env.{app_env}"))
        .unwrap_or_else(|_| panic!("Failed to load .env.{app_env}"));

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                "backend=info,axum::rejection=trace,tower_http=debug,sqlx=debug".into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let app = Router::new()
        .route("/health", get(health::get_health))
        .route("/users", post(users::post_user))
        .route("/users/:user_id", get(users::get_user))
        .route("/users/:user_id", put(users::put_user))
        .route("/rooms", post(rooms::post_room))
        .route("/rooms/:room_id", get(rooms::get_room))
        .route("/rooms/:room_id/members", post(rooms::members::post_member))
        .route(
            "/rooms/:room_id/payments",
            post(rooms::payments::post_payment),
        )
        .route(
            "/rooms/:room_id/payments",
            get(rooms::payments::get_payments),
        )
        .route(
            "/rooms/:room_id/payments/:payment_id",
            delete(rooms::payments::delete_payment),
        )
        .with_state(db_pool(&app_env).await)
        .layer(
            TraceLayer::new_for_http().make_span_with(|request: &Request<_>| {
                info_span!(
                    "🚀",
                    method = ?request.method(),
                    path = ?request
                        .extensions()
                        .get::<MatchedPath>()
                        .map(MatchedPath::as_str)
                )
            }),
        )
        .layer(
            CorsLayer::new()
                .allow_origin(vec![
                    "http://localhost:3000".parse().unwrap(),
                    "https://shamo.mtak.app".parse().unwrap(),
                ])
                .allow_methods(cors::Any)
                .allow_headers(vec![CONTENT_TYPE]),
        );

    axum::Server::bind(&"0.0.0.0:8080".parse().unwrap())
        .serve(app.into_make_service())
        .with_graceful_shutdown(shutdown_signal())
        .await
        .unwrap();
}

async fn shutdown_signal() {
    let ctrl_c = async {
        tokio::signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    let terminate = async {
        tokio::signal::unix::signal(tokio::signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    tokio::select! {
        _ = ctrl_c => {},
        _ = terminate => {},
    }

    println!("signal received, starting graceful shutdown");
}

async fn db_pool(app_env: &str) -> sqlx::Pool<sqlx::Postgres> {
    let db_connect_options = {
        let connect_options = PgConnectOptions::new()
            .host(&env::var("PGHOST").unwrap())
            .port(env::var("PGPORT").unwrap().parse::<u16>().unwrap())
            .database(&env::var("PGDATABASE").unwrap())
            .username(&env::var("PGUSER").unwrap())
            .ssl_mode(
                sqlx::postgres::PgSslMode::from_str(&env::var("PGSSLMODE").unwrap()).unwrap(),
            );

        if app_env == "production" {
            connect_options
                .password(&env::var("PGPASSWORD").unwrap())
                .ssl_root_cert(env::var("PGSSLROOTCERT").unwrap())
        } else {
            connect_options
        }
    };

    PgPoolOptions::new()
        .max_connections(5)
        .connect_with(db_connect_options)
        .await
        .expect("Can't connect to DB")
}
