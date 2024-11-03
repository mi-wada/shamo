import React from "react";

import { HistoryScreen } from "@/features/rooms";

type PageProps = {
  params: {
    roomId: string;
  };
};

const Page: React.FC<PageProps> = ({ params }) => {
  return <HistoryScreen roomId={params.roomId} />;
};

export default Page;
