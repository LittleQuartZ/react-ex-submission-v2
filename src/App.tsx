import {
  createReactRouter,
  createRouteConfig,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import Navbar from "./components/Navbar";
import { indexRoute } from "./pages";
import { Provider } from "react-redux";
import store from "./states";
import { loginRoute } from "./pages/login";
import { registerRoute } from "./pages/register";
import { threadDetailRoute } from "./pages/threads/[id]";

export const routeConfig = createRouteConfig().addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  threadDetailRoute,
]);

export const rootRouter = createReactRouter({ routeConfig });

function App() {
  return (
    <RouterProvider router={rootRouter}>
      <Provider store={store}>
        <Navbar />
        <Outlet />
      </Provider>
    </RouterProvider>
  );
}

export default App;
