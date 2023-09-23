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
    let user = UserRepository::new(pool).get_by_id(user_id).await;

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
    picture_url: Option<String>,
}

pub async fn post_user(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateUserPayload>,
) -> (StatusCode, Json<User>) {
    let user = UserRepository::new(pool)
        .create(
            Uuid::new_v4().to_string(),
            payload.name,
            payload.picture_url,
        )
        .await;

    (StatusCode::CREATED, Json(user))
}
