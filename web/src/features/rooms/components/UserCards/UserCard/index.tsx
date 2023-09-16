import { Card, CardContent, Typography } from "@mui/material";

function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
}

type UserCardProps = {
  name: string;
  totalPrice: number;
};

export const UserCard = ({ name, totalPrice }: UserCardProps) => (
  <Card sx={{ minWidth: "170px", minHeight: "110px" }}>
    <CardContent sx={{ padding: 0 }}>
      <Typography variant="body1" component="p" sx={{ textAlign: "center", margin: "8px" }}>
        {name}
      </Typography>
      <Typography
        variant="body1"
        component="p"
        sx={{ fontWeight: "bold", textAlign: "center", marginTop: "8px", fontSize: "2rem" }}
      >
        {formatCurrency(totalPrice)}
      </Typography>
    </CardContent>
  </Card>
);
