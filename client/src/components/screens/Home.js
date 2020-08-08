import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";
import Loading from "../LoadingComponent";
import M from "materialize-css";
import ReactTooltip from "react-tooltip";
import { Online, Offline } from "react-detect-offline";
import Nonet from "./Offline";

const Home = () => {
  const [data, setData] = useState(undefined);
  const { state, dispatch } = useContext(UserContext);
  const [extracomments, setExtracomments] = useState(true);
  // console.log(state);
  useEffect(() => {
    fetch("/allpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result.posts);
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
    if (text.length === 0 || text === null) {
      M.toast({
        html: "Cannot Post Empty Comment",
        classes: "#f44336 red",
      });
      return;
    }
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
        M.toast({
          html: "Commented Successfully",
          classes: "#4caf50 green",
        });
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

  const deletePost = (postId, publicId) => {
    // console.log(publicId);
    fetch(`/deletepost/${postId}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        M.toast({
          html: "Post deleted Successfully",
          classes: "#4caf50 green",
        });
        // console.log(result);
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
      });
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
        M.toast({
          html: "Comment deleted Successfully",
          classes: "#4caf50 green",
        });
        // console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) return result;
          else return item;
        });
        setData(newData);
      });
  };
  const savepost = (id) => {
    fetch("/savedposts", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);

        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, savedposts: result.savedposts }),
        );
        dispatch({ type: "ADDSAVEDPOSTS", payload: result.savedposts });
      });
  };
  // console.log(data);

  const removesavedposts = (id) => {
    fetch("/deletesavedposts", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, saved: result.savedposts }),
        );
        dispatch({ type: "ADDSAVEDPOSTS", payload: result.savedposts });
      });
  };

  return (
    <>
      {data ? (
        data.length ? (
          <div className="home">
            {data.map((item) => {
              return (
                <div className="card home-card" key={item._id}>
                  <h5 style={{ padding: "1.5%" }}>
                    <Link
                      data-tip="click to check profile"
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

                    {item.postedBy._id === (state && state._id) && (
                      <i
                        data-tip="delete post"
                        className="material-icons"
                        style={{
                          cursor: "pointer",
                          color: "red",
                          float: "right",
                          marginTop: "1%",
                        }}
                        onClick={() =>
                          deletePost(
                            item._id,
                            item.photo.split("/")[7].split(".")[0],
                          )
                        }
                      >
                        delete
                      </i>
                    )}
                  </h5>
                  <div className="card-image">
                    <img
                      style={{ objectFit: "cover" }}
                      src={item.photo}
                      alt=""
                    />
                  </div>
                  <div className="card-content">
                    {item.likes.includes(state._id) ? (
                      <i
                        data-tip="Unlike"
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
                        data-tip="Like"
                        className="material-icons"
                        onClick={() => {
                          likePost(item._id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        favorite_border
                      </i>
                    )}
                    {state.savedposts && state.savedposts.includes(item._id) ? (
                      <i
                        data-tip="save post"
                        className="fa fa-bookmark fa-2x"
                        style={{
                          cursor: "pointer",
                          float: "right",
                          marginTop: "1%",
                        }}
                        onClick={() => removesavedposts(item._id)}
                      ></i>
                    ) : (
                      <i
                        data-tip="save post"
                        className="fa fa-bookmark-o fa-2x"
                        style={{
                          cursor: "pointer",
                          float: "right",
                          marginTop: "1%",
                        }}
                        onClick={() => savepost(item._id)}
                      ></i>
                    )}
                    <h6>{item.likes.length} Likes</h6>
                    <h6>{item.title}</h6>
                    <p>{item.body}</p>
                    {item.comments.length ? (
                      <></>
                    ) : (
                      <h6 className="mt-2">
                        <bold>Be the first to comment</bold>
                      </h6>
                    )}
                    {item.comments.slice(0, 3).map((record) => {
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
                                <span data-tip="delete comment">
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
                    {item.comments.length > 3 && (
                      <>
                        <button
                          className="btn btn-secondary"
                          data-toggle="collapse"
                          data-target="#collapseExample"
                          style={{ color: "white" }}
                          onClick={() => {
                            setExtracomments(!extracomments);
                          }}
                        >
                          {extracomments ? (
                            <>
                              <h6>
                                View {item.comments.length - 3}{" "}
                                {item.comments.length - 3 > 1
                                  ? "more comments"
                                  : "more comment"}
                                <i className="fa fa-sort-down ml-2"></i>
                              </h6>
                            </>
                          ) : (
                            <i className="fa fa-sort-up"></i>
                          )}
                        </button>
                        <div className="collapse" id="collapseExample">
                          <div className="card card-body">
                            {item.comments
                              .slice(3, item.comments.length)
                              .map((record) => {
                                return (
                                  <h6 key={record._id}>
                                    <div className="row mt-1">
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
                                          <span data-tip="delete comment">
                                            <i
                                              className="material-icons"
                                              style={{
                                                cursor: "pointer",
                                                color: "red",
                                                marginRight: "2%",
                                              }}
                                              onClick={() => {
                                                deleteComment(
                                                  item._id,
                                                  record._id,
                                                );
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
                          </div>
                        </div>
                      </>
                    )}

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
                          <i
                            className="material-icons prefix"
                            style={{ marginTop: "1.5%" }}
                          >
                            comment
                          </i>
                          <input type="text" placeholder="add a comment" />
                        </div>
                        <div className="input-field col-3 col-md-1">
                          <button
                            href="#"
                            data-tip="Post comment"
                            className="btn-floating #1e88e5 blue darken-1 text-darken-5 pulse"
                            style={{ outline: "none" }}
                          >
                            <i className="material-icons right white-text ">
                              send
                            </i>
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  <ReactTooltip />
                </div>
              );
            })}
          </div>
        ) : (
          <div>
            <div className="empty offset-3 mt-5 offset-md-4">
              <i className="fa fa-frown-o fa-5x offset-1"></i>
            </div>
            <div
              className="col-12 offset-1 offset-md-4"
              style={{ fontSize: "250%" }}
            >
              No User posted Yet
            </div>
          </div>
        )
      ) : (
        <>
          <Online>
            <Loading />
          </Online>
          <Offline>
            <Nonet />
          </Offline>
        </>
      )}
    </>
  );
};

export default Home;
