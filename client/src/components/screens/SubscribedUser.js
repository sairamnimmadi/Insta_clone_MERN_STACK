import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import Loading from "../LoadingComponent";

const SubUserPost = () => {
  const [data, setData] = useState(undefined);
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setData(result.posts);
      });
  }, []);

  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const unlikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        text,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((error) => console.log(error));
  };
  const deleteComment = (postId, commentId) => {
    fetch("/deletecomment", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        postId: postId,
        commentId: commentId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) return result;
          else return item;
        });
        setData(newData);
      });
  };

  return (
    <>
      {data ? (
        <div className="home">
          {data.map((item) => {
            return (
              <div className="card home-card" key={item._id}>
                <h5 style={{ padding: "1.5%" }}>
                  <Link
                    to={
                      item.postedBy._id !== state._id
                        ? "/profile/" + item.postedBy._id
                        : "/profile"
                    }
                    style={{ textDecoration: "none" }}
                  >
                    <img
                      src={item.postedBy.pic}
                      alt=""
                      style={{
                        height: "35px",
                        width: "35px",
                        borderRadius: "17.5px",
                        marginRight: "3%",
                        objectFit: "fill",
                      }}
                    />
                    {item.postedBy.name}
                  </Link>
                </h5>
                <div className="card-image">
                  <img style={{ objectFit: "cover" }} src={item.photo} alt="" />
                </div>
                <div className="card-content">
                  {item.likes.includes(state._id) ? (
                    <i
                      className="material-icons"
                      onClick={() => {
                        unlikePost(item._id);
                      }}
                      style={{ cursor: "pointer", color: "red" }}
                    >
                      favorite
                    </i>
                  ) : (
                    <i
                      className="material-icons"
                      onClick={() => {
                        likePost(item._id);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      favorite_border
                    </i>
                  )}
                  <h6>{item.likes.length} Likes</h6>
                  <h6>{item.title}</h6>
                  <p>{item.body}</p>
                  {item.comments.map((record) => {
                    return (
                      <h6 key={record._id}>
                        <div className="row mt-3">
                          <div className="col-10">
                            <span
                              style={{
                                fontWeight: "bolder",
                                marginRight: "2%",
                              }}
                            >
                              {record.postedBy.name}
                            </span>
                            {record.text}
                          </div>
                          <div className="col-2">
                            {record.postedBy._id === state._id && (
                              <span>
                                <i
                                  className="material-icons"
                                  style={{
                                    cursor: "pointer",
                                    color: "red",
                                    marginRight: "2%",
                                  }}
                                  onClick={() => {
                                    deleteComment(item._id, record._id);
                                  }}
                                >
                                  delete
                                </i>
                              </span>
                            )}
                          </div>
                        </div>
                      </h6>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      makeComment(e.target[0].value, item._id);
                      e.target[0].value = "";
                    }}
                    style={{ height: "60px" }}
                  >
                    <div className="row">
                      <div className="input-field col-9 col-md-10">
                        <i class="material-icons prefix">create</i>
                        <input type="text" placeholder="add a comment" />
                      </div>
                      <div className="input-field col-3 col-md-2">
                        <button className="btn btn-secondary">Post</button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default SubUserPost;
