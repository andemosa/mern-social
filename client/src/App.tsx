import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import MainRouter from "MainRouter";

import theme from "./theme";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MainRouter />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
