import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../App";
import { useParams, useHistory } from "react-router-dom";
import Loading from "./LoadingComponent";

const UserProfile = () => {
  const { userid } = useParams();

  const { dispatch } = useContext(UserContext);

  const check = JSON.parse(localStorage.getItem("user"));

  const history = useHistory();

  if (userid === check._id) {
    history.push("/profile");
  }

  const [userProfile, setProfile] = useState(null);

  const [showFollow, setShowFollow] = useState(true);

  //   console.log(userid);

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        //setPics(result.mypost);
        console.log(result);

        setProfile(result);
      });
  }, []);
  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        unfollowId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProfile((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id,
          );
          return {
            ...prevState,
            user: {
              ...prevState.user,
              followers: newFollower,
            },
          };
        });
        setShowFollow(true);
      });
  };
  return (
    <>
      {userProfile !== null ? (
        userProfile.user === undefined ? (
          <div>
            <div className="empty offset-3 offset-md-5">
              <i className="fa fa-frown-o fa-5x"></i>
            </div>
            <div style={{ fontSize: "600%" }} className="offset-md-3 offset-1">
              User Not Found
            </div>
          </div>
        ) : (
          <div
            className="profile col-12 col-lg-8 offset-lg-2"
            style={{ overflowX: "hidden" }}
          >
            <div
              className="row"
              style={{
                margin: "3% 0%",
                borderBottom: "1px solid grey",
              }}
            >
              <div className="row col-12 col-md-7">
                <div className="propic col col-md-12">
                  <img
                    src={userProfile.user.pic}
                    alt=""
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "80px",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div className="mt-5 col-12">
                  <h1>{userProfile.user.name}</h1>
                </div>
                <div className="col-12">
                  <h3>{userProfile.user.email}</h3>
                </div>
              </div>
              <div className="col-md-5 mt-md-5">
                <div className="row">
                  <div className="col-2 offset-1">
                    <div className="row" style={{ marginLeft: "2%" }}>
                      <h4>{userProfile.posts.length}</h4>
                    </div>
                    <div className="row">
                      <h4>Posts</h4>
                    </div>
                  </div>
                  <div className="col-2 offset-1">
                    <div className="row" style={{ marginLeft: "40%" }}>
                      <h4>{userProfile.user.followers.length}</h4>
                    </div>
                    <div className="row">
                      <h4>followers</h4>
                    </div>
                  </div>
                  <div className="col-2 offset-2">
                    <div className="row" style={{ marginLeft: "50%" }}>
                      <h4>{userProfile.user.following.length}</h4>
                    </div>
                    <div className="row">
                      <h4>following</h4>
                    </div>
                  </div>
                  {!check.following.includes(userid) ? (
                    <button
                      className="btn waves-effect waves-light #64b5f6 blue darken-1 offset-4 mt-md-5"
                      onClick={() => followUser()}
                    >
                      Follow
                    </button>
                  ) : (
                    <button
                      className="btn waves-effect waves-light #64b5f6 red darken-1 offset-4 mt-md-5"
                      onClick={() => unfollowUser()}
                    >
                      un Follow
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="gallery row">
              {userProfile ? (
                userProfile.posts.length !== 0 ? (
                  <div className="gallery row">
                    {userProfile.posts.map((item) => {
                      return (
                        <img
                          className="item col-4 mt-4"
                          src={item.photo}
                          key={item._id}
                          alt={item.title}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty offset-3 offset-md-5">
                    <div>
                      <i className="fa fa-frown-o fa-5x"></i>
                    </div>
                    <div>No posts Yet</div>
                  </div>
                )
              ) : (
                <Loading />
              )}
            </div>
          </div>
        )
      ) : (
        <div className="load col-12 offset-md-4" style={{ marginTop: "100px" }}>
          <span
            className="fa fa-refresh fa-spin fa-5x fa-fw text-primary"
            style={{ marginLeft: "10%" }}
          ></span>
          <h2 className="symbol">Loading . . . .</h2>
        </div>
      )}
    </>
  );
};

export default UserProfile;
