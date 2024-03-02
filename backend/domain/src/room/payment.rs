use uuid::Uuid;

use crate::RoomId;

use super::MemberId;

#[derive(serde::Serialize, Clone, sqlx::Type)]
#[sqlx(transparent)]
pub struct PaymentId(pub String);
impl Default for PaymentId {
    fn default() -> Self {
        Self(Uuid::now_v7().to_string())
    }
}

#[derive(serde::Serialize, sqlx::FromRow)]
pub struct Payment {
    pub id: PaymentId,
    pub room_id: RoomId,
    pub room_member_id: MemberId,
    #[sqlx(try_from = "i64")]
    pub amount: u64,
    pub note: Option<String>,
}
