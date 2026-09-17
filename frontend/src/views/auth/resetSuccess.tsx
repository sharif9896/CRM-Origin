import { all_routes } from "../../routes/all_routes";
import SuccessPage from "./successPage";

const ResetSuccess = () => (
  <SuccessPage
    title="Password Reset Successful!"
    message="Your password has been changed successfully. You can now sign in with your new password."
    steps={[
      { title: "Account Secured", detail: "Your new password is now active." },
      { title: "All Sessions Signed Out", detail: "Other devices have been logged out for safety." },
      { title: "Confirmation Sent", detail: "We've emailed you a confirmation of this change." },
    ]}
    actionLabel="Continue to Sign In"
    actionTo={all_routes.login}
  />
);

export default ResetSuccess;
