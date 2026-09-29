// app.config.js — dynamische Konfiguration via .env
// Secrets dürfen NICHT in die Versionsverwaltung.

module.exports = {
  expo: {
    name: "Kundenportal",
    slug: "portal-kunden-app",
    scheme: "kundenportal",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    ios: {
      supportsTablet: false,
      bundleIdentifier: "com.portal.kunden",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#1E5BB8",
        foregroundImage: "./assets/android-icon-foreground.png",
      },
    },
    web: { bundler: "metro" },
    platforms: ["ios", "android"],
    plugins: ["expo-router", "expo-splash-screen"],
    experiments: { typedRoutes: true },
    extra: {
      keycloakUrl:    process.env.KEYCLOAK_URL     ?? "http://localhost:8080",
      keycloakRealm:  process.env.KEYCLOAK_REALM   ?? "portal",
      keycloakClientId: process.env.KEYCLOAK_CLIENT_ID ?? "kunden-app",
      backendUrl:     process.env.BACKEND_URL      ?? "http://localhost:3001",
      eas: {
        projectId: "29e63455-a4f1-46ea-8909-873ac243f753",
      },
    },
    owner: "maxboxer",
    updates: {
      url: "https://u.expo.dev/29e63455-a4f1-46ea-8909-873ac243f753",
    },
    runtimeVersion: {
      policy: "appVersion",
    },
  },
};
