pub type UserId = String;

#[derive(serde::Serialize)]
pub struct User {
    pub id: UserId,
    pub name: String,
    pub icon_url: Option<String>,
}

impl User {
    pub fn change_name(self, name: String) -> Self {
        User { name, ..self }
    }
}
