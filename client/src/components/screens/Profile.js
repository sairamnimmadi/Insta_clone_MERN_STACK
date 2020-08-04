import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";
import Loading from "../LoadingComponent";
import M from "materialize-css";

var deflink =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTjA0Lpsg840JNGLaPgVWM9QofkvAYdFPLb-g&usqp=CAU";

const Profile = () => {
  const [mypics, setPics] = useState(undefined);
  const { state, dispatch } = useContext(UserContext);
  var publicId;

  if (state && state.pic !== deflink) {
    publicId = JSON.parse(localStorage.getItem("user"))
      .pic.split("/")[7]
      .split(".")[0];
  }
  useEffect(() => {
    fetch("/myposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        setPics(result.mypost);
      });
  }, []);

  const deletePic = () => {
    fetch("/deleteprofilepic", {
      method: "put",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        publicId: state.pic !== deflink ? publicId : "",
        pic: deflink,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(
          "user",
          JSON.stringify({ ...state, pic: data.pic }),
        );
        M.toast({
          html: "Deleted Profile pic Successfully",
          classes: "#4caf50 green",
        });
        dispatch({ type: "DELETEPROFILE", payload: data.pic });
      });
  };
  return (
    <div className="profile col-12 col-lg-8 offset-lg-2">
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
              src={state ? state.pic : <Loading />}
              alt=""
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "80px",
                objectFit: "cover",
              }}
            />
            {state && state.pic !== deflink ? (
              <div>
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => deletePic()}
                >
                  Delete profile pic
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-5 col-md-12">
            <h1>{state ? state.name : <Loading />}</h1>
          </div>
          <div className="col-md-12">
            <h3>{state ? state.email : <Loading />}</h3>
          </div>
        </div>
        <div className="col-md-5 mt-5">
          <div className="row">
            <div className="col-2 offset-1">
              <div className="row" style={{ marginLeft: "2%" }}>
                <h4>
                  {mypics ? (
                    mypics.length
                  ) : (
                    <span className="fa fa-spinner fa-pulse fa fa-fw text-primary"></span>
                  )}
                </h4>
              </div>
              <div className="row">
                <h4>Posts</h4>
              </div>
            </div>
            <div className="col-2 offset-1">
              <div className="row" style={{ marginLeft: "40%" }}>
                <h4>{state ? state.followers.length : 0}</h4>
              </div>
              <div className="row">
                <h4>Followers</h4>
              </div>
            </div>
            <div className="col-2 offset-2">
              <div className="row" style={{ marginLeft: "50%" }}>
                <h4>{state ? state.following.length : 0}</h4>
              </div>
              <div className="row">
                <h4>Following</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
      {mypics ? (
        mypics.length !== 0 ? (
          <div className="gallery row">
            {mypics.map((item) => {
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
  );
};

export default Profile;
