pub mod members;
pub mod payments;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{Room, RoomId, UserId};
use infra::RoomRepository;
use sqlx::PgPool;

use crate::utils::error::ErrorResponseBody;

#[derive(serde::Deserialize)]
pub struct CreateRoomPayload {
    name: String,
    emoji: String,
    created_by: String,
}

// curl -X POST -H 'Content-Type: application/json' http://localhost:8080/rooms -d '{"name": "ほげほげ", "created_by": "1"}'
pub async fn post_room(
    State(pool): State<PgPool>,
    Json(payload): Json<CreateRoomPayload>,
) -> (StatusCode, Json<Room>) {
    let room = RoomRepository::new(pool)
        .create(payload.name, payload.emoji, UserId(payload.created_by))
        .await;

    (StatusCode::CREATED, Json(room))
}

#[derive(serde::Serialize)]
#[serde(untagged)]
pub enum GetRoomResponse {
    Ok(Room),
    NotFound(ErrorResponseBody),
}

pub async fn get_room(
    State(pool): State<PgPool>,
    Path(room_id): Path<String>,
) -> (StatusCode, Json<GetRoomResponse>) {
    let room = RoomRepository::new(pool).get_by_id(RoomId(room_id)).await;

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
