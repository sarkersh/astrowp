import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import icon from "astro-icon";

import netlify from "@astrojs/netlify";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), icon({
    include: {
      mdi: ["account", "account-plus", "account-minus", "search"]
    }
  })],
  output: 'server',
  // Or 'hybrid' if needed
  adapter: netlify()
});