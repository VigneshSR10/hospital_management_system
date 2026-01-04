import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Screens/Dashboard.jsx";
import Billing from "./Screens/Billing.jsx";
import PatientLedger from "./Screens/PatientLedger.jsx";
import { Provider } from "react-redux";
import { store } from "./store/index.jsx";
export default function App() {
  return (
    <>
     <Provider store={store}>
      <Routes>
        <Route path="/" element={<Dashboard />}>
          <Route index element={<Billing />} />
          <Route path="billing" element={<Billing />} />
          <Route path="billing/:mrn" element={<PatientLedger />} />
        </Route>
      </Routes>
      </Provider>
    </>
  );
}
