import React, { useContext } from "react";
import { Card, Icon, Label, Button } from "semantic-ui-react";
import moment from "moment";
import "moment/locale/id";
import { Link } from "react-router-dom";
import "./PostCard.css";
import { AuthContext } from "../context/auth";
import LikeButton from "./LikeButton";
import DeleteButton from "./DeleteButton";
import MyPopup from "../util/MyPopup";

function PostCard({
  post: { body, createdAt, id, username, likeCount, commentCount, likes },
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card className="card">
      <Card.Content>
        <Card.Header>{username}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          {moment(createdAt).locale("id").fromNow()}
        </Card.Meta>
        <Card.Description>{body}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <LikeButton user={user} post={{ id, likes, likeCount }} />
        <MyPopup content="Komentar">
          <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
            <Button icon>
              <Icon name="comments" />
            </Button>
            <Label basic pointing="left">
              {commentCount}
            </Label>
          </Button>
        </MyPopup>
        {user && user.username === username && <DeleteButton postId={id} />}
      </Card.Content>
    </Card>
  );
}

export default PostCard;
