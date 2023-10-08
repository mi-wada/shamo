use domain::{
    room::{Member, MemberId, RoomRepository},
    Room, RoomId, User, UserId,
};
pub struct RoomCommand<'a> {
    pub room_repository: Box<dyn RoomRepository + Send + 'a>,
}

impl<'a> RoomCommand<'a> {
    pub async fn create_room(&mut self, name: String, emoji: String, created_by: String) -> Room {
        let room = Room {
            id: RoomId::default(),
            name,
            emoji,
            created_by: UserId(created_by.clone()),
            members: vec![Member {
                id: MemberId::default(),
                room_id: RoomId::default(),
                user: User {
                    id: UserId(created_by.clone()),
                    name: "test".to_string(),
                    icon_url: None,
                },
                total_amount: 0,
            }],
        };

        self.room_repository.save(&room).await;

        room
    }
}
