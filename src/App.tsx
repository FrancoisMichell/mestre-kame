import { SWRConfig } from "swr";
import { LRUCache } from "./lib/swr-config";
import Router from "./router";

// Cache limitado para evitar memory leaks
const swrCache = new LRUCache(20); // Máximo de 20 páginas em cache

function App() {
  return (
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
  );
}

export default App;
