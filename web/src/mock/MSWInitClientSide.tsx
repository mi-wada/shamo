"use client";

import { useState } from "react";

async function prepare() {
  if (process.env.NEXT_PUBLIC_ENABLE_MOCK) {
    const { initMocks } = await import("@/mock");
    await initMocks();
  }

  return Promise.resolve();
}

export const MSWInitClientSide = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);

  prepare().then(() => {
    setLoading(false);
  });

  if (loading === true) {
    return <></>;
  }

  return children;
};
