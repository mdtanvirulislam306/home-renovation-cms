declare module "react-compare-image" {
  import type { ComponentType } from "react";

  interface ReactCompareImageProps {
    leftImage: string;
    rightImage: string;
    sliderLineColor?: string;
    sliderLineWidth?: number;
    handleSize?: number;
    hover?: boolean;
    skeleton?: React.ReactNode;
    vertical?: boolean;
  }

  const ReactCompareImage: ComponentType<ReactCompareImageProps>;
  export default ReactCompareImage;
}
