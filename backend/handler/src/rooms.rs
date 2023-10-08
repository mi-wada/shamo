pub mod members;
pub mod payments;

use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{room, Room, RoomId};
use infra::{room_query::RoomQuery, RoomRepository};
use sqlx::PgPool;
use usecase::query::room_query::{RoomQuery as RoomQueryTrait, RoomQueryResult};

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

    let room_repository = Box::new(RoomRepository { conn: &mut conn });
    let room = usecase::command::room_command::RoomCommand { room_repository }
        .create_room(payload.name, payload.emoji, payload.created_by)
        .await;

    (StatusCode::CREATED, Json(room))
}

#[derive(serde::Serialize)]
#[serde(untagged)]
pub enum GetRoomResponse {
    Ok(RoomQueryResult),
    NotFound(ErrorResponseBody),
}

pub async fn get_room(
    State(pool): State<PgPool>,
    Path(room_id): Path<String>,
) -> (StatusCode, Json<GetRoomResponse>) {
    let room = RoomQuery {
        conn: &mut pool.acquire().await.unwrap(),
    }
    .get_by_id(RoomId(room_id))
    .await;

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
