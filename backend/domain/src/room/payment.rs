use uuid::Uuid;

use crate::RoomId;

use super::MemberId;

#[derive(serde::Serialize, Clone)]
pub struct PaymentId(pub String);
impl Default for PaymentId {
    fn default() -> Self {
        Self(Uuid::now_v7().to_string())
    }
}

#[derive(serde::Serialize)]
pub struct Payment {
    pub id: PaymentId,
    pub room_id: RoomId,
    pub room_member_id: MemberId,
    pub amount: u64,
    pub note: Option<String>,
}

#[async_trait::async_trait]
pub trait PaymentRepository {
    async fn save(&mut self, payment: &Payment);
    async fn get_payments_by_room_id(&mut self, room_id: RoomId) -> Vec<Payment>;
    async fn delete(&mut self, id: PaymentId);
}
