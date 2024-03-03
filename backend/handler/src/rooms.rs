pub mod members;
pub mod payments;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{Room, RoomId, UserId};
use sqlx::PgPool;
use usecase::{create_room, GetRoomResult};

use crate::utils::error::ErrorResponseBody;

#[derive(serde::Deserialize)]
pub struct CreateRoomPayload {
    name: String,
    emoji: String,
    created_by: String,
}

pub async fn post_room(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateRoomPayload>,
) -> (StatusCode, Json<Room>) {
    let mut conn = pool.acquire().await.unwrap();

    let room = create_room(
        &mut conn,
        payload.name,
        payload.emoji,
        UserId(payload.created_by),
    )
    .await
    .unwrap();

    (StatusCode::CREATED, Json(room))
}

#[derive(serde::Serialize)]
#[serde(untagged)]
pub enum GetRoomResponse {
    Ok(GetRoomResult),
    NotFound(ErrorResponseBody),
}

pub async fn get_room(
    State(pool): State<PgPool>,
    Path(room_id): Path<String>,
) -> (StatusCode, Json<GetRoomResponse>) {
    let mut conn = pool.acquire().await.unwrap();

    let room = usecase::get_room(&mut *conn, &RoomId(room_id))
        .await
        .unwrap();

    match room {
        Some(room) => (StatusCode::OK, Json(GetRoomResponse::Ok(room))),
        None => (
            StatusCode::NOT_FOUND,
            Json(GetRoomResponse::NotFound(ErrorResponseBody {
                errors: vec![crate::utils::error::ErrorItem {
                    field: "room_id".into(),
                    code: "not_found".into(),
                    message: "room not found".into(),
                }],
            })),
        ),
    }
}
