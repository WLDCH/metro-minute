resource "google_service_account" "sa_web_app" {
  account_id   = "web-app"
  display_name = "Metro Minute Web App"
  description  = "Metro Minute Web App service account"
}

resource "google_project_iam_binding" "cloud_sql_admin" {
  project = var.project
  role    = "roles/cloudsql.admin"

  members = [
    "serviceAccount:${google_service_account.sa_web_app.email}"
  ]
}

resource "google_project_iam_binding" "cloud_sql_client" {
  project = var.project
  role    = "roles/cloudsql.client"

  members = [
    "serviceAccount:${google_service_account.sa_web_app.email}"
  ]
}

resource "google_secret_manager_secret_iam_binding" "api_token_secret_access" {
  secret_id = google_secret_manager_secret.api_token.id
  members   = ["serviceAccount:${google_service_account.sa_web_app.email}"]
  role      = "roles/secretmanager.secretAccessor"
}

resource "google_secret_manager_secret_iam_binding" "postgres_password_secret_access" {
  secret_id = google_secret_manager_secret.postgres_password.id
  members   = ["serviceAccount:${google_service_account.sa_web_app.email}"]
  role      = "roles/secretmanager.secretAccessor"
}

resource "google_project_iam_binding" "cloud_run_admin" {
  project = var.project
  role    = "roles/run.admin"

  members = [
    "serviceAccount:${google_service_account.sa_web_app.email}"
  ]
}

resource "google_project_iam_binding" "cloud_run_invoker" {
  project = var.project
  role    = "roles/run.invoker"

  members = [
    "serviceAccount:${google_service_account.sa_web_app.email}"
  ]
}
