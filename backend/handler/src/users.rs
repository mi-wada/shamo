use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{repository::user_repository, User, UserId};
use sqlx::PgPool;

use crate::utils::error::{ErrorItem, ErrorResponseBody};

#[derive(serde::Serialize)]
#[serde(untagged)]
pub enum GetUserResponse {
    Ok(User),
    NotFound(ErrorResponseBody),
}

pub async fn get_user(
    State(pool): State<PgPool>,
    Path(user_id): Path<String>,
) -> (StatusCode, Json<GetUserResponse>) {
    let mut conn = pool.acquire().await.unwrap();

    let user = user_repository::get_by_id(&mut conn, &UserId(user_id))
        .await
        .unwrap();

    match user {
        Some(user) => (StatusCode::OK, Json(GetUserResponse::Ok(user))),
        None => (
            StatusCode::NOT_FOUND,
            Json(GetUserResponse::NotFound(ErrorResponseBody {
                errors: vec![ErrorItem {
                    field: "user_id".into(),
                    code: "not_found".into(),
                    message: "user not found".into(),
                }],
            })),
        ),
    }
}

#[derive(serde::Deserialize)]
pub struct CreateUserPayload {
    name: String,
    icon_url: Option<String>,
}

pub async fn post_user(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateUserPayload>,
) -> (StatusCode, Json<User>) {
    let mut conn = pool.acquire().await.unwrap();
    let user = User {
        id: UserId::default(),
        name: payload.name,
        icon_url: payload.icon_url,
    };

    user_repository::add(&mut conn, &user).await.unwrap();

    (StatusCode::CREATED, Json(user))
}

#[derive(serde::Deserialize)]
pub struct UpdateUserPayload {
    name: String,
    icon_url: Option<String>,
}

pub async fn put_user(
    State(pool): State<PgPool>,
    Path(user_id): Path<String>,
    Json(payload): Json<UpdateUserPayload>,
) -> StatusCode {
    let mut conn = pool.acquire().await.unwrap();
    let user = User {
        id: UserId(user_id),
        name: payload.name,
        icon_url: payload.icon_url,
    };

    user_repository::update(&mut conn, &user).await.unwrap();

    StatusCode::NO_CONTENT
}
