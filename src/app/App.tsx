import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./state/auth";
import { PresentationStoreProvider } from "./state/presentationStore";

export default function App() {
  return (
    <AuthProvider>
      <PresentationStoreProvider>
        <RouterProvider router={router} />
      </PresentationStoreProvider>
    </AuthProvider>
  );
}