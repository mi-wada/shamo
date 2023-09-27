import { Avatar, Box, Card, CardActionArea, CardContent, Typography } from "@mui/material";

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
  <Card sx={{ width: "160px" }}>
    <CardActionArea onClick={onClick(member)}>
      <CardContent sx={{ padding: "0px 4px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "45px",
          }}
        >
          <Avatar alt="user icon" src={member.user.iconUrl} sx={{ width: 30, height: 30 }} />
          <Typography
            variant="body1"
            component="span"
            sx={{ marginLeft: "4px", overflowWrap: "break-word" }}
          >
            {member.user.name}
          </Typography>
        </Box>
        <Typography
          variant="body1"
          component="p"
          sx={{ fontWeight: "bold", textAlign: "center", fontSize: "1.4rem" }}
        >
          {formatCurrency(totalAmount)}
        </Typography>
      </CardContent>
    </CardActionArea>
  </Card>
);
