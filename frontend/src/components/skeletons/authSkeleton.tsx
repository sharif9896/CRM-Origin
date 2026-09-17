import { SkeletonBox, SkeletonText } from "./primitives";
import { repeat } from "./utils";

type Props = {
  fields?: number;
  /** Divider + social sign-in buttons (login/register only). */
  social?: boolean;
};

/** Mirrors <AuthCard /> chrome: logo block, centered card, footer note. */
const AuthSkeleton = ({ fields = 2, social = true }: Props) => (
  <div className="login-container p-4 w-full max-w-[420px] mx-auto">
    <div className="text-center mb-8">
      <SkeletonBox className="h-12 w-36 mx-auto" />
    </div>

    <div className="bg-white rounded-2xl shadow-2xl p-8">
      <div className="text-center mb-8">
        <SkeletonBox className="h-8 w-48 mx-auto mb-3" />
        <SkeletonText className="w-64 mx-auto" />
      </div>

      {repeat(fields).map((i) => (
        <div key={i} className="mb-5">
          <SkeletonText className="h-3 w-20 mb-2" />
          <SkeletonBox className="h-10 w-full rounded-lg" />
        </div>
      ))}

      <SkeletonBox className="h-12 w-full rounded-lg mb-6" />

      {social && (
        <>
          <div className="relative my-6 flex justify-center">
            <SkeletonText className="w-32" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <SkeletonBox className="h-10 rounded-lg" />
            <SkeletonBox className="h-10 rounded-lg" />
          </div>
        </>
      )}

      <SkeletonText className="w-48 mx-auto" />
    </div>

    <div className="text-center mt-8">
      <SkeletonText className="w-56 mx-auto opacity-50" />
    </div>
  </div>
);

export default AuthSkeleton;
