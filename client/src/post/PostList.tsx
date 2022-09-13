import { IPost } from "types/Post";

interface IProps {
  posts: IPost[];
  removeUpdate: (post: Partial<IPost>) => void;
}

export default function PostList(props: IProps) {
  return (
    <div style={{ marginTop: "24px" }}>
      {props.posts.map((item, i) => {
        return <Post post={item} key={i} onRemove={props.removeUpdate} />;
      })}
    </div>
  );
}
