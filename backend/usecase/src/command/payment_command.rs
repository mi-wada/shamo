use domain::{
    room::{payment::PaymentRepository, MemberId, Payment, PaymentId},
    RoomId,
};
pub struct PaymentCommand<'a> {
    pub payment_repository: Box<dyn PaymentRepository + Send + 'a>,
}

impl<'a> PaymentCommand<'a> {
    pub async fn create_payment(
        &mut self,
        room_id: RoomId,
        room_member_id: MemberId,
        amount: u64,
        note: Option<String>,
    ) -> Payment {
        let payment = Payment {
            id: PaymentId::default(),
            room_id,
            room_member_id,
            amount,
            note,
        };

        self.payment_repository.save(&payment).await;

        payment
    }
}
