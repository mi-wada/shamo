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
    member_id: String,
    amount: u64,
    note: Option<String>,
}

pub async fn post_payment(
    State(pool): State<PgPool>,
    Path(room_id): Path<String>,
    Json(payload): Json<CreatePaymentPayload>,
) -> (StatusCode, Json<Payment>) {
    let payment = RoomRepository::new(pool)
        .add_payment(
            RoomId(room_id),
            MemberId(payload.member_id),
            payload.amount,
            payload.note,
        )
        .await;

    (StatusCode::CREATED, Json(payment))
}

pub async fn get_payments(
    State(pool): State<PgPool>,
    Path(room_id): Path<String>,
) -> (StatusCode, Json<Vec<Payment>>) {
    let room = RoomRepository::new(pool)
        .get_payments(RoomId(room_id))
        .await;

    // TODO: 404, room
    (StatusCode::OK, Json(room))
}

pub async fn delete_payment(
    State(pool): State<PgPool>,
    Path((room_id, payment_id)): Path<(String, String)>,
) -> StatusCode {
    RoomRepository::new(pool)
        .remove_payment(RoomId(room_id), PaymentId(payment_id))
        .await;

    StatusCode::NO_CONTENT
}
