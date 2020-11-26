import React, { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { AuthContext } from "../context/auth";
import { Grid, Loader, Transition } from "semantic-ui-react";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import "./Home.css";

function Home() {
  const { user } = useContext(AuthContext);
  const { loading, data: { getPosts: posts } = {} } = useQuery(
    FETCH_POSTS_QUERY
  );

  return (
    <div className="home">
      <Grid columns={1}>
        <Grid.Row>
          {user && (
            <Grid.Column className="homeForm">
              <PostForm />
            </Grid.Column>
          )}
          {loading ? (
            <Loader active inline="centered">
              Memuat...
            </Loader>
          ) : (
            <Transition.Group duration={1000}>
              {posts &&
                posts.map((post) => (
                  <Grid.Column className="homeCard" key={post.id}>
                    <PostCard post={post} />
                  </Grid.Column>
                ))}
            </Transition.Group>
          )}
        </Grid.Row>
      </Grid>
    </div>
  );
}

export default Home;
