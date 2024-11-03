import { Box } from "@mui/material";

import { Member } from "../../types/room";

import { UserCard } from "./UserCard";

type UserCardsProps = {
  members: Member[];
  cardOnClick: (member: Member) => () => void;
};

export const UserCards = ({ members, cardOnClick }: UserCardsProps) => (
  <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "16px" }}>
    {members.map((member) => (
      <UserCard
        key={member.id}
        member={member}
        totalAmount={member.totalAmount}
        onClick={cardOnClick}
      />
    ))}
  </Box>
);
