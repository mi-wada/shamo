use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{
    repository::room_repository::add_member,
    room::{Member, MemberId},
    RoomId, UserId,
};
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

    let member = add_member(
        &mut conn,
        MemberId::default(),
        RoomId(room_id),
        UserId(payload.user_id),
    )
    .await
    .unwrap();

    (StatusCode::CREATED, Json(member))
}
