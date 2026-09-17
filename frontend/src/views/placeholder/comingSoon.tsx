import { useLocation } from "react-router-dom";

const ComingSoon = () => {
  const { pathname } = useLocation();
  return (
    <div className="content">
      <div className="card">
        <div className="card-body text-center py-16">
          <span className="size-14 mx-auto mb-4 rounded-full bg-primary-transparent text-primary flex items-center justify-center text-2xl">
            <i className="icon-hammer" />
          </span>
          <h5 className="text-title font-bold mb-2">Page not built yet</h5>
          <p className="mb-0">
            <code>{pathname}</code> is routed, but its view is still being ported.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
