import { LocationProvider, Router, Route } from "preact-iso";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SecondaryPage from "./pages/SecondaryPage";

function App() {
  return (
    <LocationProvider>
      <Layout>
        <Router>
          <Route path="/" component={Home} />
          <Route path="/secondary" component={SecondaryPage} />
        </Router>
      </Layout>
    </LocationProvider>
  );
}

export default App;
