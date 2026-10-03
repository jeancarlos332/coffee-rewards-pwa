import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isAdmin = env.VITE_APP_MODE === "admin";

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: isAdmin ? "Coffee Rewards Admin" : "Coffee Rewards",
          short_name: isAdmin ? "Rewards Admin" : "Coffee Rewards",
          description: isAdmin
            ? "Aplicación de administración de Coffee Rewards"
            : "Programa de fidelización de Coffee Rewards",
          start_url: "/",
          display: "standalone",
          background_color: "#fffdf8",
          theme_color: "#3b2418",
          icons: [
            {
              src: isAdmin
                ? "/coffee-rewards-admin-192.png"
                : "/coffee-rewards-192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: isAdmin
                ? "/coffee-rewards-admin-512.png"
                : "/coffee-rewards-512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  };
});
