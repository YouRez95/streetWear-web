import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./index.css";
import { AppWrapper } from "./layouts/AppWrapper";
import App from "./App";
import Dashboard from "./pages/dashboard";
import Products from "./pages/products";
import Producer from "./pages/faconnier";
import Stylists from "./pages/stylist";
import Clients from "./pages/clients";
import StockReturn from "./pages/stockReturn";
import Settings from "./pages/settings";
import { ErrorPage } from "./pages/error";
import Workers from "./pages/workers";
import "react-lazy-load-image-component/src/effects/blur.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: true,
      staleTime: 0, // 0 minute as default stale time
      gcTime: 5 * 60 * 1000, // 5 minutes as default cache time
    },
  },
});

(window as any).queryClient = queryClient;

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppWrapper />,
    children: [
      {
        element: <App />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          {
            path: "/products",
            element: <Products />,
          },
          {
            path: "/stylists",
            element: <Stylists />,
          },
          {
            path: "/producers",
            element: <Producer />,
          },
          {
            path: "/clients",
            element: <Clients />,
          },
          {
            path: "/settings",
            element: <Settings />,
          },
          {
            path: "/stock-return",
            element: <StockReturn />,
          },
          {
            path: "/workers",
            element: <Workers />,
          },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>
);
