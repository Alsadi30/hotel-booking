return {
    name = "oidc",
    fields = {
      { config = {
          type = "record",
          fields = {
            { keycloak_introspection_url = { type = "string", required = true, description = "URL to the Keycloak introspection endpoint" } },
            { client_id = { type = "string", required = true, description = "Client ID for OIDC" } },
            { client_secret = { type = "string", required = true, description = "Client Secret for OIDC" } }
          }
        }
      }
    }
  }
  