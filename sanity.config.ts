import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schema } from "./sanity/schemaTypes";
import { structure,defaultDocumentNode } from "./sanity/structure";
import { presentationTool } from "sanity/presentation";

export default defineConfig({
  basePath: "/admin/studio",
  projectId: "etzfr0pl",
  dataset: "production",
  schema,
  plugins: [
    structureTool({ structure,defaultDocumentNode }), // ✅ custom order dashboard
    visionTool({
      defaultApiVersion: process.env.VITE_SANITY_API_VERSION || "2024-11-09",
    }),
    presentationTool({
      previewUrl: {
        preview: "/",
        previewMode: {
          enable: "/draft-mode/enable",
        },
      },
    }),
  ],
});
