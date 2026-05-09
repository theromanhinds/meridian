import { ConvexProvider } from "convex/react";
import { convex } from "./convex/client";
import { Workspace } from "./components/layout/Workspace";

export default function App() {
  return (
    <ConvexProvider client={convex}>
      <div className="dark">
        <Workspace />
      </div>
    </ConvexProvider>
  );
}
