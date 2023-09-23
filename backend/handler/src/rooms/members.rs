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
    user_id: UserId,
}

// curl -X POST -H 'Content-Type: application/json' http://localhost:8080/rooms -d '{"name": "ほげほげ", "created_by": "1"}'
pub async fn post_member(
    State(pool): State<PgPool>,
    Path(room_id): Path<RoomId>,
    Json(payload): Json<CreateMemberPayload>,
) -> (StatusCode, Json<Member>) {
    let member = RoomRepository::new(pool)
        .add_member(room_id, payload.user_id)
        .await;

    (StatusCode::CREATED, Json(member))
}
