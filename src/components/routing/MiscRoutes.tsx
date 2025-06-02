
import { Route } from "react-router-dom";
import SprintDataRoomPage from "@/pages/SprintDataRoomPage";
import FAQsPage from "@/pages/FAQsPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function MiscRoutes() {
  return (
    <>
      <Route path="/sprint/data-room/:sprintId" element={<SprintDataRoomPage />} />
      <Route path="/faqs" element={<FAQsPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </>
  );
}
