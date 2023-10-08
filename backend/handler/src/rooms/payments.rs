use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{
    room::{payment::PaymentRepository as PaymentRepositoryTrait, MemberId, Payment, PaymentId},
    RoomId,
};
use infra::{payment_repository::PaymentRepository, RoomRepository};
use sqlx::PgPool;
use usecase::command::payment_command::PaymentCommand;

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
    let mut conn = pool.acquire().await.unwrap();

    let payment_repository = Box::new(PaymentRepository { conn: &mut conn });
    let payment = PaymentCommand { payment_repository }
        .create_payment(
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
    let mut conn = pool.acquire().await.unwrap();
    let room = PaymentRepository { conn: &mut conn }
        .get_payments_by_room_id(RoomId(room_id))
        .await;

    (StatusCode::OK, Json(room))
}

pub async fn delete_payment(
    State(pool): State<PgPool>,
    Path((room_id, payment_id)): Path<(String, String)>,
) -> StatusCode {
    let mut conn = pool.acquire().await.unwrap();
    PaymentRepository { conn: &mut conn }
        .delete(PaymentId(payment_id))
        .await;

    StatusCode::NO_CONTENT
}
