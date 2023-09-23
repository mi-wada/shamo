use crate::RoomId;

use super::MemberId;

pub type PaymentId = String;

#[derive(serde::Serialize)]
pub struct Payment {
    pub id: PaymentId,
    pub room_id: RoomId,
    pub room_member_id: MemberId,
    pub amount: u64,
    pub note: Option<String>,
}
