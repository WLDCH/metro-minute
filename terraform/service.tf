resource "google_cloud_run_v2_service" "metro-minute-web-app" {
  name     = "metro-minute-web-app"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.sa_web_app.email

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.metro_minute_postgres.connection_name]
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }

    containers {
      image = "europe-west1-docker.pkg.dev/metro-minute/metro-minute-docker/metro-minute-web:latest"

      resources {
        limits = {
          cpu    = "1"
          memory = "1Gi"
        }
        cpu_idle = true
      }

      env {
        name  = "DATABASE_HOST"
        value = "/cloudsql/${google_sql_database_instance.metro_minute_postgres.connection_name}"
      }
      env {
        name  = "DATABASE_NAME"
        value = "metrominute"
      }
      env {
        name  = "DATABASE_USER"
        value = "postgres"
      }
      env {
        name = "DATABASE_PASSWORD"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.postgres_password.secret_id
            version = "latest"
          }
        }
      }
      env {
        name  = "DATABASE_PORT"
        value = "5432"
      }
      env {
        name = "API_TOKEN"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.api_token.secret_id
            version = "latest"
          }
        }
      }
    }
  }
}

resource "google_cloud_run_service_iam_member" "noauth" {
  service  = google_cloud_run_v2_service.metro-minute-web-app.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
