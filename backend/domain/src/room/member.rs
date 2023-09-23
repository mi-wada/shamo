use crate::{RoomId, User};

pub type MemberId = String;

#[derive(serde::Serialize)]
pub struct Member {
    pub id: MemberId,
    pub room_id: RoomId,
    pub user: User,
    pub total_amount: u64,
}
