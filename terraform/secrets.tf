resource "google_secret_manager_secret" "api_token" {
  secret_id = "api_token"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "api_token_1" {
  secret      = google_secret_manager_secret.api_token.id
  secret_data = var.api_token
}

resource "google_secret_manager_secret" "postgres_password" {
  secret_id = "postgres_password"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "postgres-password_1" {
  secret      = google_secret_manager_secret.postgres_password.id
  secret_data = random_password.postgres_password.result
}

