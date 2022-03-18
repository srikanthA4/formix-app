import { Formik } from "formik";
import { Table, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";

function PostApp1() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    (async function () {
      try {
        const { data } = await axios.get(
          "https://jsonplaceholder.typicode.com/posts"
        );
        setPosts(data);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  async function deletePost(id) {
    try {
      await axios.delete(`https://jsonplaceholder.typicode.com/posts/${id}`);
      const data = posts.filter((post) => post.id !== id);
      setPosts(data);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Formik
      initialValues={{
        id: "",
        userId: "",
        title: "",
        body: ""
      }}
      validate={() => {}}
      onSubmit={async (values) => {
        if (values.id) {
          try {
            const { id, userId, title, body } = values;
            console.log(userId, title, body);
            const {
              data
            } = await axios.put(
              `https://jsonplaceholder.typicode.com/posts/${id}`,
              { userId, title, body }
            );
            const tempposts = posts;
            const index = tempposts.findIndex((post) => post.id === id);
            tempposts[index] = data;
            setPosts(tempposts);
          } catch (err) {
            console.error(err);
          }
        } else {
          //createPost();
          try {
            const { userId, title, body } = values;
            const {
              data
            } = await axios.post(
              "https://jsonplaceholder.typicode.com/posts/",
              { userId, title, body }
            );
            const tempposts = [...posts];
            tempposts.push(data);
            console.log(tempposts);
            console.log(posts);
            setPosts([...tempposts]);
            values.id = "";
            values.userId = "";
            values.title = "";
            values.body = "";
          } catch (err) {
            console.error(err);
          }
        }
      }}
    >
      {({ values, handleChange, handleSubmit, errors }) => {
        return (
          <>
            <h2> Post App</h2>
            <form onSubmit={handleSubmit}>
              <div>
                <label>User ID: </label>
                <input
                  type="number"
                  name="userId"
                  onChange={handleChange}
                  value={values.userId}
                />
              </div>
              <br />
              <div>
                <label>Title: </label>
                <input
                  type="text"
                  name="title"
                  onChange={handleChange}
                  value={values.title}
                />
              </div>
              <br />
              <div>
                <label>Body: </label>
                <input
                  type="text"
                  name="body"
                  onChange={handleChange}
                  value={values.body}
                />
              </div>
              <br />
              <div>
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
              <br />
            </form>
            <Table responsive striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => {
                  return (
                    <tr key={post.id}>
                      <td>{post.id}</td>
                      <td>{post.userId}</td>
                      <td>{post.title}</td>
                      <td>{post.body}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => deletePost(post.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            return (
                              <>
                                {(values.id = post.id)}
                                {(values.userId = post.userId)}
                                {(values.title = post.title)}
                                {(values.body = post.body)}
                              </>
                            );
                          }}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </>
        );
      }}
    </Formik>
  );
}

export default PostApp1;
