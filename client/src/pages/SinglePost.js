import React, { useContext, useRef, useState } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  Button,
  Card,
  Form,
  Grid,
  Icon,
  Label,
  Loader,
  Transition,
} from "semantic-ui-react";
import moment from "moment";
import "moment/locale/id";
import { AuthContext } from "../context/auth";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";
import "./SinglePost.css";
import MyPopup from "../util/MyPopup";

function SinglePost(props) {
  const postId = props.match.params.postId;
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState("");
  const commentInputRef = useRef(null);

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
  });

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    update() {
      setComment("");
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: comment,
    },
    onError(err) {
      return err;
    },
  });

  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;
  if (!getPost) {
    postMarkup = <Loader />;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid columns={1}>
        <Grid.Row>
          <Grid.Column className="singlePost">
            <Card>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>
                  {moment(createdAt).locale("id").fromNow()}
                </Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <MyPopup content="Komentar">
                  <Button as="div" labelPosition="right">
                    <Button icon>
                      <Icon name="comments" />
                    </Button>
                    <Label basic pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                </MyPopup>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
          </Grid.Column>
          {user && (
            <Grid.Column className="singlePostComment">
              <Card>
                <Card.Content>
                  <Form onSubmit={submitComment}>
                    <Form.Input
                      label="Komentar"
                      placeholder="Tambahkan Komentar"
                      name="comment"
                      type="text"
                      value={comment}
                      onChange={(event) => setComment(event.target.value)}
                      ref={commentInputRef}
                    />
                    <Button
                      type="submit"
                      color="blue"
                      disabled={comment.trim() === ""}
                    >
                      Kirim
                    </Button>
                  </Form>
                </Card.Content>
              </Card>
            </Grid.Column>
          )}
          <Grid.Column className="singlePostComment">
            <Transition.Group duration={1000}>
              {comments.map((comment) => (
                <Card key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && (
                      <DeleteButton postId={id} commentId={comment.id} />
                    )}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>
                      {moment(comment.createdAt).locale("id").fromNow()}
                    </Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
                </Card>
              ))}
            </Transition.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;

const FETCH_POST_QUERY = gql`
  query($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      likes {
        id
        username
      }
      commentCount
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

export default SinglePost;
