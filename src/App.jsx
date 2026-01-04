import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/index.jsx";
import { lazy, Suspense, useEffect, useState } from "react";
import SplashScreen from "./Components/SplashScreen.jsx";
const Dashboard = lazy(() => import("./Screens/Dashboard.jsx"));
const Billing = lazy(() => import("./Screens/Billing.jsx"));
const PatientLedger = lazy(() => import("./Screens/PatientLedger.jsx"));

export default function App() {
   const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // simulate app init / auth / config loading
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500); // adjust timing

    return () => clearTimeout(timer);
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }
  return (
    <Provider store={store}>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Dashboard />}>
            <Route index element={<Billing />} />
            <Route path="billing" element={<Billing />} />
            <Route path="billing/:mrn" element={<PatientLedger />} />
          </Route>
        </Routes>
      </Suspense>
    </Provider>
  );
}
