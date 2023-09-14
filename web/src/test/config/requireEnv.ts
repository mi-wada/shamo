import { loadEnvConfig } from "@next/env";

const requireEnv = async () => {
  const projectDir = process.cwd();
  loadEnvConfig(projectDir);
};

export default requireEnv;
