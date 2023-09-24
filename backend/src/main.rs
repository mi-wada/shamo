use std::{env, str::FromStr, time::Duration};

use axum::{
    body::Bytes,
    extract::MatchedPath,
    http::{header::CONTENT_TYPE, HeaderMap, HeaderValue, Request},
    response::Response,
    routing::{delete, get, post},
    Router,
};
use handler::{health, rooms, users};
use sqlx::postgres::{PgConnectOptions, PgPoolOptions};
use tower_http::{
    classify::ServerErrorsFailureClass,
    cors::{self, CorsLayer},
    trace::TraceLayer,
};
use tracing::{info_span, Span};
use tracing_subscriber::{prelude::__tracing_subscriber_SubscriberExt, util::SubscriberInitExt};

#[tokio::main]
async fn main() {
    let app_env = env::var("ENV").expect("ENV not set");

    let env_file_name = format!(".env.{}", app_env);
    dotenvy::from_filename(env_file_name).expect(&format!("Failed to load .env.{}", app_env));

    tracing_subscriber::registry()
        // .with(
        //     tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
        //         // axum logs rejections from built-in extractors with the `axum::rejection`
        //         // target, at `TRACE` level. `axum::rejection=trace` enables showing those events
        //         "example_tracing_aka_logging=debug,tower_http=debug,axum::rejection=trace".into()
        //     }),
        // )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let connect_options = if &app_env == "production" {
        PgConnectOptions::new()
            .host(&env::var("PGHOST").unwrap())
            .port(env::var("PGPORT").unwrap().parse::<u16>().unwrap())
            .database(&env::var("PGDATABASE").unwrap())
            .username(&env::var("PGUSER").unwrap())
            .password(&env::var("PGPASSWORD").unwrap())
            .ssl_mode(sqlx::postgres::PgSslMode::from_str(&env::var("PGSSLMODE").unwrap()).unwrap())
            .ssl_root_cert(&env::var("PGSSLROOTCERT").unwrap())
    } else {
        PgConnectOptions::new()
            .host(&env::var("PGHOST").unwrap())
            .port(env::var("PGPORT").unwrap().parse::<u16>().unwrap())
            .database(&env::var("PGDATABASE").unwrap())
            .username(&env::var("PGUSER").unwrap())
            .password(&env::var("PGPASSWORD").unwrap())
            .ssl_mode(sqlx::postgres::PgSslMode::from_str(&env::var("PGSSLMODE").unwrap()).unwrap())
            .ssl_client_cert(&env::var("PGSSLCERT").unwrap())
            .ssl_client_key(&env::var("PGSSLKEY").unwrap())
            .ssl_root_cert(&env::var("PGSSLROOTCERT").unwrap())
    };

    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect_with(connect_options)
        .await
        .expect("Can't connect to DB");

    let app = Router::new()
        .route("/health", get(health::get_health))
        // curl -X POST -H 'Content-Type: application/json' http://localhost:8080/users -d '{"name": "ほげほげ", "icon_url": "http://hoge.com"}'
        .route("/users", post(users::post_user))
        .route("/users/:user_id", get(users::get_user))
        // curl -X POST -H 'Content-Type: application/json' http://localhost:8080/rooms -d '{"name": "ほげほげ", "created_by": "1"}'
        .route("/rooms", post(rooms::post_room))
        // curl -X GET -H 'Content-Type: application/json' http://localhost:8080/rooms/73da8f05-a946-447c-ba51-05278a44da9e
        .route("/rooms/:room_id", get(rooms::get_room))
        // curl -X POST -H 'Content-Type: application/json' http://localhost:8080/rooms/73da8f05-a946-447c-ba51-05278a44da9e/members -d '{"user_id": "1"}'
        .route("/rooms/:room_id/members", post(rooms::members::post_member))
        // curl -X POST -H 'Content-Type: application/json' http://localhost:8080/rooms/73da8f05-a946-447c-ba51-05278a44da9e/payments -d '{"member_id": "1", "amount": 1000, "note": "hoge"}'
        .route(
            "/rooms/:room_id/payments",
            post(rooms::payments::post_payment),
        )
        // curl -X GET -H 'Content-Type: application/json' http://localhost:8080/rooms/73da8f05-a946-447c-ba51-05278a44da9e/payments
        .route(
            "/rooms/:room_id/payments",
            get(rooms::payments::get_payments),
        )
        // curl -X DELETE http://localhost:8080/rooms/73da8f05-a946-447c-ba51-05278a44da9e/payments/73da8f05-a946-447c-ba51-05278a44da9e
        .route(
            "/rooms/:room_id/payments/:payment_id",
            delete(rooms::payments::delete_payment),
        )
        .with_state(pool)
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(|request: &Request<_>| {
                    // Log the matched route's path (with placeholders not filled in).
                    // Use request.uri() or OriginalUri if you want the real path.
                    let matched_path = request
                        .extensions()
                        .get::<MatchedPath>()
                        .map(MatchedPath::as_str);

                    info_span!(
                        "http_request",
                        method = ?request.method(),
                        matched_path,
                        some_other_field = tracing::field::Empty,
                    )
                })
                .on_request(|_request: &Request<_>, _span: &Span| {
                    // You can use `_span.record("some_other_field", value)` in one of these
                    // closures to attach a value to the initially empty field in the info_span
                    // created above.
                })
                .on_response(|_response: &Response, _latency: Duration, _span: &Span| {
                    // ...
                })
                .on_body_chunk(|_chunk: &Bytes, _latency: Duration, _span: &Span| {
                    // ...
                })
                .on_eos(
                    |_trailers: Option<&HeaderMap>, _stream_duration: Duration, _span: &Span| {
                        // ...
                    },
                )
                .on_failure(
                    |_error: ServerErrorsFailureClass, _latency: Duration, _span: &Span| {
                        // ...
                    },
                ),
        )
        .layer(
            CorsLayer::new()
                .allow_origin(vec![
                    "http://localhost:3000".parse().unwrap(),
                    "https://shamo.app".parse().unwrap(),
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
