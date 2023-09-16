import { User } from "../../../types/user";
import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
}

type UserCardProps = {
  user: User;
  totalPrice: number;
  onClick: (user: User) => () => void;
};

export const UserCard = ({ user, totalPrice, onClick }: UserCardProps) => (
  <Card sx={{ minWidth: "170px" }}>
    <CardActionArea onClick={onClick(user)}>
      <CardContent sx={{ padding: 0 }}>
        <Typography variant="body1" component="p" sx={{ textAlign: "center", margin: "8px" }}>
          {user.name}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ fontWeight: "bold", textAlign: "center", margin: "8px", fontSize: "1.6rem" }}
        >
          {formatCurrency(totalPrice)}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);
