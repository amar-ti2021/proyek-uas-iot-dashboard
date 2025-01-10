import { RouterProvider } from "react-router-dom";
import router from "./lib/router";
import { Provider } from "./components/ui/provider";
function App() {
  return (
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  );
}
export default App;
