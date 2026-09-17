import { Link } from "react-router-dom";
import AuthCard from "../../components/ui/authCard";

export type SuccessStep = { title: string; detail: string };

type Props = {
  title: string;
  message: string;
  steps: SuccessStep[];
  actionLabel: string;
  actionTo: string;
};

const SuccessPage = ({ title, message, steps, actionLabel, actionTo }: Props) => (
  <AuthCard>
    <div className="success-animation">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success/10 mb-6 checkmark-animation">
          <i className="icon-check text-3xl! text-success" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-base text-gray-600">{message}</p>
      </div>

      <div className="space-y-3 mb-8">
        {steps.map((step) => (
          <div
            key={step.title}
            className="flex items-start gap-3 p-3 rounded-lg bg-success/5 border border-success/20"
          >
            <div className="flex-shrink-0">
              <i className="icon-check text-lg text-success mt-0.5" />
            </div>
            <div className="text-sm">
              <p className="font-medium text-gray-900">{step.title}</p>
              <p className="text-gray-600">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to={actionTo}
        className="w-full py-3 px-4 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-hover hover:text-white transition inline-flex items-center justify-center"
      >
        {actionLabel}
      </Link>
    </div>
  </AuthCard>
);

export default SuccessPage;
