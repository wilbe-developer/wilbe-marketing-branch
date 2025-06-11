
import { Route } from "react-router-dom";
import { PATHS } from "@/lib/constants";
import MerchPage from "@/pages/MerchPage";
import LoginPage from "@/pages/LoginPage";
import AdminLoginPage from "@/pages/AdminLoginPage";
import PasswordResetPage from "@/pages/PasswordResetPage";
import LandingPageOld from "@/components/LandingPageOld";
import BsfPage from "@/components/BsfOld";
import QuizPage from "@/pages/QuizPage";
import SprintSignupPage from "@/pages/SprintSignupPage";
import SprintWaitingPage from "@/pages/SprintWaitingPage";
import SprintPage from "@/pages/SprintPage";
import SprintWaitlistPage from "@/pages/SprintWaitlistPage";
import SprintReferralPage from "@/pages/SprintReferralPage";
import AcceptInvitationPage from "@/pages/AcceptInvitationPage";

export default function PublicRoutes() {
  return (
    <>
      {/* Public merch chooser route */}
      <Route path="/merch" element={<MerchPage />} />

      {/* Auth routes */}
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      <Route path="/admin-login" element={<AdminLoginPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />
      <Route path={PATHS.LANDING_PAGE} element={<LandingPageOld />} />
      <Route path={PATHS.BSF_PAGE} element={<BsfPage />} />

      {/* Quiz route - publicly accessible */}
      <Route path={PATHS.QUIZ} element={<QuizPage />} />

      {/* Sprint signup - publicly accessible */}
      <Route path="/sprint-signup" element={<SprintSignupPage />} />
      <Route path={PATHS.SPRINT_WAITING} element={<SprintWaitingPage />} />

      {/* Sprint routes - accessible to all authenticated users */}
      <Route path={PATHS.SPRINT} element={<SprintPage />} />

      {/* Sprint waitlist routes */}
      <Route path="/waitlist" element={<SprintWaitlistPage />} />
      <Route path="/referral" element={<SprintReferralPage />} />
      <Route path="/ref/:code" element={<SprintWaitlistPage />} />
      
      {/* Team invitation acceptance route */}
      <Route path={PATHS.ACCEPT_INVITATION} element={<AcceptInvitationPage />} />
    </>
  );
}
