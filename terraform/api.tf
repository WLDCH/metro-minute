resource "google_project_service" "cloud_run" {
    project = var.project
    service = "run.googleapis.com"
    disable_on_destroy = false
}

resource "google_project_service" "artifact_registry" {
    project = var.project
    service = "artifactregistry.googleapis.com"
    disable_on_destroy = false
}

resource "google_project_service" "secrets" {
    project = var.project
    service = "secretmanager.googleapis.com"
    disable_on_destroy = false
}

resource "google_project_service" "cloud_sql" {
    project = var.project
    service = "sqladmin.googleapis.com"
    disable_on_destroy = false
}