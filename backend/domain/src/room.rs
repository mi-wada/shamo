mod member;
pub use member::{Member, MemberId};

mod payment;
pub use payment::{Payment, PaymentId};

use crate::UserId;

pub type RoomId = String;

#[derive(serde::Serialize)]
pub struct Room {
    pub id: RoomId,
    pub name: String,
    pub created_by: UserId,
    pub members: Vec<Member>,
}
