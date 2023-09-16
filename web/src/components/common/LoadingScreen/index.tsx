import { Container } from "@mui/material";
import { Loading as LoadingComponent } from "@/components/common/Loading";

export const LoadingScreen = () => (
  <Container
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      // NOTE: The height of AppBar is subtracted.
      // Therefore, if the height of AppBar is changed, it must be changed.
      // Also, if a Footer is added, it is necessary to subtract the height of Footer too.
      height: "calc(100vh - 90.88px)",
    }}
  >
    <LoadingComponent size={"medium"} />
  </Container>
);
