terraform {
  backend "gcs" {
    bucket = "shamo-mtak-app-terraform-state-bucket"
    prefix = "terraform/state"
  }
}
