use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{room::Member, RoomId, UserId};
use infra::RoomRepository;
use sqlx::PgPool;

#[derive(serde::Deserialize)]
pub struct CreateMemberPayload {
    user_id: String,
}

pub async fn post_member(
    State(pool): State<PgPool>,
    Path(room_id): Path<String>,
    Json(payload): Json<CreateMemberPayload>,
) -> (StatusCode, Json<Member>) {
    let mut conn = pool.acquire().await.unwrap();
    let member = RoomRepository { conn: &mut conn }
        .add_member(RoomId(room_id), UserId(payload.user_id))
        .await;

    (StatusCode::CREATED, Json(member))
}
