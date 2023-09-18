use std::error::Error;

fn main() -> Result<(), Box<dyn Error>> {
    let env_file_name = format!(".env.{}", std::env::var("ENV")?);
    dotenvy::from_filename(env_file_name)?;

    println!("{}", dotenvy::var("ENV")?);

    Ok(())
}
