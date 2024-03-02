use axum::{
    extract::{Path, State},
    http::StatusCode,
    Json,
};
use domain::{
    repository::payment_repository::{self, get_list_by_room_id},
    room::{MemberId, Payment, PaymentId},
    RoomId,
};
use sqlx::PgPool;
use usecase::add_payment;

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

    let payment = add_payment(
        &mut conn,
        RoomId(room_id),
        MemberId(payload.member_id),
        payload.amount,
        payload.note.clone(),
    )
    .await
    .unwrap();

    (StatusCode::CREATED, Json(payment))
}

pub async fn get_payments(
    State(pool): State<PgPool>,
    Path(room_id): Path<String>,
) -> (StatusCode, Json<Vec<Payment>>) {
    let mut conn = pool.acquire().await.unwrap();

    let payments = get_list_by_room_id(&mut conn, &RoomId(room_id))
        .await
        .unwrap();

    (StatusCode::OK, Json(payments))
}

pub async fn delete_payment(
    State(pool): State<PgPool>,
    Path((room_id, payment_id)): Path<(String, String)>,
) -> StatusCode {
    let mut conn = pool.acquire().await.unwrap();

    payment_repository::delete(&mut conn, &PaymentId(payment_id))
        .await
        .unwrap();

    StatusCode::NO_CONTENT
}
