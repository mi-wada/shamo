import React from "react";

import { HomeScreen } from "@/features/rooms";

type PageProps = {
  params: {
    roomId: string;
  };
};

const Page: React.FC<PageProps> = ({ params }) => {
  return <HomeScreen roomId={params.roomId} />;
};

export default Page;
