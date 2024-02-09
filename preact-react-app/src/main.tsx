import { render } from "preact";
import App from "./App.tsx";
import '@cmsgov/ds-healthcare-gov/css/index.css';
import '@cmsgov/ds-healthcare-gov/css/healthcare-theme.css';

const root = document.getElementById("root") ?? new HTMLDivElement();
root.innerHTML = "";
render(<App />, root);
