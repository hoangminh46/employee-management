import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "@/styles/GlobalStyles.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <GlobalStyles>
        <App />
      </GlobalStyles>
    </BrowserRouter>
  </Provider>
);
