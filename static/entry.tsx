/**
 * Entry point for the fully static build (`bun run build:static`).
 * Renders the exact same page client-side, so the output in `dist/`
 * can be uploaded to any plain hosting (OVH / FileZilla) with no Node.js.
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import Index from "@/routes/index";
import AniimoCursor from "@/components/AniimoCursor";
import "@/styles.css";

const queryClient = new QueryClient();

function App() {
  const Page = Index.options.component!;
  return (
    <QueryClientProvider client={queryClient}>
      <Page />
      <AniimoCursor />
    </QueryClientProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
