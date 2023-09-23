use crate::{RoomId, UserId};

pub type MemberId = String;

#[derive(serde::Serialize)]
pub struct Member {
    pub id: MemberId,
    pub room_id: RoomId,
    pub user_id: UserId,
    pub total_amount: u64,
}
