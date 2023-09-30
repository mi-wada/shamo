use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{User, UserId};
use infra::UserRepository;
use sqlx::PgPool;
use uuid::Uuid;

use crate::utils::error::{ErrorItem, ErrorResponseBody};

#[derive(serde::Serialize)]
#[serde(untagged)]
pub enum GetUserResponse {
    Ok(User),
    NotFound(ErrorResponseBody),
}

pub async fn get_user(
    State(pool): State<PgPool>,
    Path(user_id): Path<UserId>,
) -> (StatusCode, Json<GetUserResponse>) {
    let user = UserRepository::get_by_id(user_id, &mut pool.acquire().await.unwrap()).await;

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
    let user = User {
        id: Uuid::new_v4().to_string(),
        name: payload.name,
        icon_url: payload.icon_url,
    };

    UserRepository::save(&user, &mut pool.acquire().await.unwrap()).await;

    (StatusCode::CREATED, Json(user))
}

#[derive(serde::Deserialize)]
pub struct UpdateUserPayload {
    name: String,
    icon_url: Option<String>,
}

pub async fn put_user(
    State(pool): State<PgPool>,
    Path(user_id): Path<UserId>,
    Json(payload): Json<UpdateUserPayload>,
) -> StatusCode {
    let user = User {
        id: user_id,
        name: payload.name,
        icon_url: payload.icon_url,
    };

    UserRepository::save(&user, &mut pool.acquire().await.unwrap()).await;

    StatusCode::NO_CONTENT
}
