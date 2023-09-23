import { Card, CardActionArea, CardContent, Typography } from "@mui/material";

import { Member } from "../../../types/room";

function formatCurrency(amount: number): string {
  const formatter = new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    minimumFractionDigits: 0,
  });

  return formatter.format(amount);
}

type UserCardProps = {
  member: Member;
  totalAmount: number;
  onClick: (member: Member) => () => void;
};

export const UserCard = ({ member, totalAmount, onClick }: UserCardProps) => (
  <Card sx={{ minWidth: "170px" }}>
    <CardActionArea onClick={onClick(member)}>
      <CardContent sx={{ padding: 0 }}>
        <Typography variant="body1" component="p" sx={{ textAlign: "center", margin: "8px" }}>
          {member.id}
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ fontWeight: "bold", textAlign: "center", margin: "8px", fontSize: "1.6rem" }}
        >
          {formatCurrency(totalAmount)}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);
