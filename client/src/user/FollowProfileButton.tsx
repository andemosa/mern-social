import { Button } from "@mui/material";
import { follow, unfollow, ICredentials, IParams } from "./api-user";

interface Callback {
  (params: IParams, credentials: ICredentials, followId: string): Promise<any>;
}

interface IProps {
  following: boolean;
  onButtonClick: (func: Callback) => void;
}

export default function FollowProfileButton(props: IProps) {
  const followClick = () => {
    props.onButtonClick(follow);
  };
  const unfollowClick = () => {
    props.onButtonClick(unfollow);
  };

  return (
    <div>
      {props.following ? (
        <Button variant="contained" color="secondary" onClick={unfollowClick}>
          Unfollow
        </Button>
      ) : (
        <Button variant="contained" color="primary" onClick={followClick}>
          Follow
        </Button>
      )}
    </div>
  );
}
