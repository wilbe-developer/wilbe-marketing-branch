
import { Route } from "react-router-dom";
import { PATHS } from "@/lib/constants";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import AcceptInvitationPage from "@/pages/AcceptInvitationPage";

export default function PublicRoutes() {
  return (
    <>
      <Route path="/" element={<LandingPage />} />
      <Route path={PATHS.LOGIN} element={<LoginPage />} />
      <Route path={PATHS.REGISTER} element={<RegisterPage />} />
      <Route path={PATHS.PASSWORD_RESET} element={<ResetPasswordPage />} />
      <Route path={PATHS.ACCEPT_INVITATION} element={<AcceptInvitationPage />} />
    </>
  );
}
