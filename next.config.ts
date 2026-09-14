import type { NextConfig } from "next";

/**
 * 커스텀 도메인(jaehoon-jieun.love)은 사이트 루트에서 서빙되므로 basePath 없음.
 * (github.io/jj-mochung 하위 경로용 basePath 는 사용하지 않음)
 */
const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  // 다른 기기(핸드폰)에서 LAN IP로 dev 서버에 접속할 때 /_next/* 자산이 차단되지 않도록 허용.
  // (Next 16는 등록되지 않은 출처의 개발 자산 요청을 막아 하이드레이션이 통째로 실패한다)
  // IP가 바뀌면(DHCP) 폰 주소창의 IP를 여기에 추가하세요.
  allowedDevOrigins: ["172.30.1.19", "172.30.1.*", "192.168.0.*", "192.168.1.*"],
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: "",
  },
};

export default nextConfig;
