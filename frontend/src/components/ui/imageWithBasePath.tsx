import { image_path } from "../../environment";
import { resolveApiAssetUrl } from "../../lib/apiClient";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string };

const ImageWithBasePath = ({ src, alt = "", ...rest }: Props) => {
  const resolved = resolveApiAssetUrl(src || "");
  const source = /^(https?:|data:|blob:)/.test(resolved)
    ? resolved
    : resolved
      ? image_path + resolved.replace(/^\//, "")
      : image_path + "assets/img/dashboard/villa-img-3.jpg";

  return <img src={source} alt={alt} {...rest} />;
};

export default ImageWithBasePath;
