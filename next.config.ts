import type { NextConfig } from "next";

/**
 * 커스텀 도메인(jaehoon-jieun.love)은 사이트 루트에서 서빙되므로 basePath 없음.
 * (github.io/jj-mochung 하위 경로용 basePath 는 사용하지 않음)
 */
const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
};

export default nextConfig;
