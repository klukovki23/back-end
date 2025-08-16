import ReactDOM from "react-dom/client";
import axios from "axios";
import App from "./App";
import "./index.css";

axios.get("https://back-end-7lsm.onrender.com/api/persons").then((response) => {
  const persons = response.data;
  ReactDOM.createRoot(document.getElementById("root")).render(<App />);
});
