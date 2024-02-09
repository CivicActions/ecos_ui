import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SecondaryPage from "./pages/SecondaryPage";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/secondary",
    element: <SecondaryPage />,
  },
]);

function App() {
  return (
      <Layout>
      <RouterProvider router={router} />
      </Layout>
  );
}

export default App;
