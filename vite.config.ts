import { defineConfig, loadEnv } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const envDefine: Record<string, string> = {};
  const loadedEnv = loadEnv(mode, process.cwd(), "VITE_");
  for (const [key, value] of Object.entries(loadedEnv)) {
    envDefine[`import.meta.env.${key}`] = JSON.stringify(value);
  }

  // Hébergement générique par défaut : un serveur Node standard (node-server),
  // compatible avec OVH, Infomaniak, et tout hébergeur supportant Node.js.
  // Surchargez via la variable d'environnement NITRO_PRESET si nécessaire.
  const nitroPreset = process.env.NITRO_PRESET || "node-server";

  return {
    define: envDefine,
    css: { transformer: "lightningcss" },
    resolve: {
      alias: { "@": `${process.cwd()}/src` },
      dedupe: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "@tanstack/react-query",
        "@tanstack/query-core",
      ],
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
      ignoreOutdatedRequests: true,
    },
    plugins: [
      tanstackStart({
        // Redirige l'entrée serveur groupée de TanStack Start vers src/server.ts
        // (notre wrapper d'erreurs SSR). nitro/vite construit à partir de ça.
        server: { entry: "server" },
      }),
      viteReact(),
      tailwindcss(),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      nitro({ preset: nitroPreset }),
    ],
  };
});
