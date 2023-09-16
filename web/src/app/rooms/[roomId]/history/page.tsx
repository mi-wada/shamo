import { HistoryScreen } from "@/features/rooms";
import React from "react";

type PageProps = {
  params: {
    roomId: string;
  };
};

const Page: React.FC<PageProps> = ({ params }) => {
  return <HistoryScreen roomId={params.roomId} />;
};

export default Page;
