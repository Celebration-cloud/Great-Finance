import { defineConfig } from "@neon/config/v1";

export default defineConfig({
  auth: true,
  branch: (branch) => ({
    protected: branch.isDefault,
    ...(branch.isDefault ? {} : { ttl: "7d" }),
  }),
});
