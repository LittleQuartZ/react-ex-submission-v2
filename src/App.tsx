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

const routeConfig = createRouteConfig().addChildren([indexRoute]);

const router = createReactRouter({ routeConfig });

function App() {
  return (
    <RouterProvider router={router}>
      <Provider store={store}>
        <Navbar />
        <div className="container mx-auto">
          <Outlet />
        </div>
      </Provider>
    </RouterProvider>
  );
}

export default App;
