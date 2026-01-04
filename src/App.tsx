import { SWRConfig } from "swr";
import { LRUCache } from "./lib/swr-config";
import Router from "./router";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { Toaster } from "sonner";

// Cache limitado para evitar memory leaks
const swrCache = new LRUCache(20); // Máximo de 20 páginas em cache

function App() {
  return (
    <ErrorBoundary>
      <SWRConfig
        value={{
          provider: () => swrCache,
          // Configurações globais do SWR
          revalidateOnFocus: false,
          revalidateOnReconnect: true,
          shouldRetryOnError: false,
        }}
      >
        <Router />
      </SWRConfig>
      <Toaster
        position="top-right"
        richColors
        closeButton
        duration={4000}
        toastOptions={{
          style: {
            fontSize: "14px",
          },
          className: "text-sm",
        }}
        // Em mobile, posição top-center é melhor
        expand={false}
        visibleToasts={3}
      />
    </ErrorBoundary>
  );
}

export default App;
