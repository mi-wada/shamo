"use client";
import { History, Home, Settings } from "@mui/icons-material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useParams, usePathname, useRouter } from "next/navigation";

type Path = {
  icon: React.ReactNode;
  path: string;
};

const PATHS: Path[] = [
  {
    icon: <Home />,
    path: "",
  },
  {
    icon: <History />,
    path: "/history",
  },
  {
    icon: <Settings />,
    path: "/settings",
  },
];

export const TogglePageButton = () => {
  const router = useRouter();
  const params = useParams();
  const currentPath = usePathname();

  const currentPathUntilRoomId = `/rooms/${params.roomId}`;

  const onChange = (_event: React.MouseEvent<HTMLElement>, newPath: string) => {
    router.push(`${currentPathUntilRoomId}/${newPath || ""}`);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      value={currentPath.replace(currentPathUntilRoomId, "")}
      exclusive
      onChange={onChange}
    >
      {PATHS.map(({ icon, path }) => (
        <ToggleButton key={path} value={path}>
          {icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
