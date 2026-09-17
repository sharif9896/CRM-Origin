import { image_path } from "../../environment";
type Props = React.ImgHTMLAttributes<HTMLImageElement> & { src: string };
const ImageWithBasePath = ({ src, alt = "", ...rest }: Props) => (
  <img src={/^(https?:|data:|blob:)/.test(src || '') ? src : src ? image_path + src.replace(/^\//, '') : image_path + 'assets/img/dashboard/villa-img-3.jpg'} alt={alt} {...rest} />
);
export default ImageWithBasePath;

