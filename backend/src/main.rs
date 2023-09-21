use axum::{http::StatusCode, Router};

#[tokio::main]
async fn main() {
    let env_file_name = format!(".env.{}", std::env::var("ENV").expect("ENV not set"));
    dotenvy::from_filename(env_file_name).expect(&format!(
        "Failed to load .env.{}",
        std::env::var("ENV").unwrap()
    ));

    println!("{}", dotenvy::var("ENV").unwrap());

    let app = Router::new().route("/health", axum::routing::get(|| async { StatusCode::OK }));
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
