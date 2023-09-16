import { HomeScreen } from "@/features/rooms";
import React from "react";

type PageProps = {
  params: {
    roomId: string;
  };
};

const Page: React.FC<PageProps> = ({ params }) => {
  return <HomeScreen roomId={params.roomId} />;
};

export default Page;
