import { all_routes } from "../../routes/all_routes";
import SuccessPage from "./successPage";

const VerifySuccess = () => (
  <SuccessPage
    title="Email Verified!"
    message="Your email address has been successfully verified. Your account is now fully active."
    steps={[
      { title: "Email Confirmed", detail: "Your address is verified and active." },
      { title: "Account Activated", detail: "You now have full access to the dashboard." },
      { title: "Ready to Go", detail: "Start managing your properties and leads." },
    ]}
    actionLabel="Go to Dashboard"
    actionTo={all_routes.dashboard}
  />
);

export default VerifySuccess;
