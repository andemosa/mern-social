import { Avatar, Typography, ImageList, ImageListItem } from "@mui/material";
import { Link } from "react-router-dom";

import { IProfile } from "types/User";

interface IProps {
  people: IProfile[];
}

export default function FollowGrid(props: IProps) {
  return (
    <div
      style={{
        paddingTop: 3,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        overflow: "hidden",
      }}
    >
      <ImageList sx={{ width: 500, height: 220 }} cols={4} rowHeight={164}>
        {props.people.map((person, i) => {
          return (
            <ImageListItem style={{ height: 120 }} key={i}>
              <Link to={"/user/" + person._id}>
                <Avatar
                  src={"/api/users/photo/" + person._id}
                  sx={{
                    width: 60,
                    height: 60,
                    margin: "auto",
                  }}
                />
                <Typography
                  sx={{
                    textAlign: "center",
                    marginTop: 10,
                  }}
                >
                  {person.name}
                </Typography>
              </Link>
            </ImageListItem>
          );
        })}
      </ImageList>
    </div>
  );
}
