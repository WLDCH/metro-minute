resource "google_cloud_run_v2_job" "metro_minute_dbt_job" {
  name     = "metro-minute-dbt"
  location = var.region

  template {
    template {
      service_account = google_service_account.sa_web_app.email

      volumes {
        name = "cloudsql"
        cloud_sql_instance {
          instances = [google_sql_database_instance.metro_minute_postgres.connection_name]
        }
      }

      containers {
        image = "europe-west1-docker.pkg.dev/metro-minute/metro-minute-docker/metro-minute-dbt:latest"

        resources {
          limits = {
            cpu    = "1"
            memory = "1Gi"
          }
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
      }
    }
  }
}
