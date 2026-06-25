import React from "react";
import { AppProvider } from "./context/AppContext";
import { AppLayout } from "./components/AppLayout";

export default function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}
