use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{
    room::{MemberId, Payment, PaymentId},
    RoomId,
};
use infra::RoomRepository;
use sqlx::PgPool;

#[derive(serde::Deserialize)]
pub struct CreatePaymentPayload {
    member_id: MemberId,
    amount: u64,
    note: Option<String>,
}

// curl -X POST -H 'Content-Type: application/json' http://localhost:8080/rooms -d '{"name": "ほげほげ", "created_by": "1"}'
pub async fn post_payment(
    State(pool): State<PgPool>,
    Path(room_id): Path<RoomId>,
    Json(payload): Json<CreatePaymentPayload>,
) -> (StatusCode, Json<Payment>) {
    let payment = RoomRepository::new(pool)
        .add_payment(room_id, payload.member_id, payload.amount, payload.note)
        .await;

    (StatusCode::CREATED, Json(payment))
}

pub async fn get_payments(
    State(pool): State<PgPool>,
    Path(room_id): Path<RoomId>,
) -> (StatusCode, Json<Vec<Payment>>) {
    let room = RoomRepository::new(pool).get_payments(room_id).await;

    // TODO: 404, room
    (StatusCode::OK, Json(room))
}

pub async fn delete_payment(
    State(pool): State<PgPool>,
    Path((room_id, payment_id)): Path<(RoomId, PaymentId)>,
) -> StatusCode {
    RoomRepository::new(pool)
        .remove_payment(room_id, payment_id)
        .await;

    StatusCode::NO_CONTENT
}
