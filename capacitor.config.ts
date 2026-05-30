import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.confluence.aihub",
  appName: "Confluence AI Hub",
  webDir: "dist/public",
  server: {
    androidScheme: "https",
    url: "https://vrkswoeg6jemc.kimi.site/",
    cleartext: false,
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    },
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      backgroundColor: "#050507",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
    },
  },
};

export default config;
