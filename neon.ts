import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  dataApi: {
    authProvider: "neon",
    settings: {
      dbAggregatesEnabled: false,
      dbMaxRows: 100,
      dbSchemas: ["public"],
      openapiMode: "disabled",
      serverTimingEnabled: false,
    },
  },
  buckets: {
    document: { access: "private" },
  },
  branch: (branch) => ({
    protected: branch.isDefault,
    ...(branch.isDefault ? {} : { ttl: "7d" }),
  }),
});
