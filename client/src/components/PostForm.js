import React, { useContext } from "react";
import { Button, Card, Form } from "semantic-ui-react";
import { useForm } from "../util/hooks";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { AuthContext } from "../context/auth";

function PostForm() {
  const { user } = useContext(AuthContext);
  const { values, onChange, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY,
      });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError(err) {
      return err;
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <Card>
      <Card.Content>
        <Form onSubmit={onSubmit}>
          <h2>{`Selamat datang ${user.username}, ingin berbagi sesuatu dengan WeFame?`}</h2>
          <Form.Field>
            <Form.Input
              placeholder="Berbagi dengan WeFame"
              name="body"
              onChange={onChange}
              value={values.body}
            />
            <Button type="submit" color="blue">
              Kirim
            </Button>
          </Form.Field>
        </Form>
        {error && (
          <div className="ui error message">
            <ul>
              <li>{error.graphQLErrors[0].message}</li>
            </ul>
          </div>
        )}
      </Card.Content>
    </Card>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;
