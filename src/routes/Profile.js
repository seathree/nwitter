import React from "react";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { dbService } from "fbase";
import { useState } from "react";

// eslint-disable-next-line import/no-anonymous-default-export
export default ({ refreshUser, userObj }) => {
  const history = useHistory();

  let name = "";
  if (userObj.displayName !== null) {
    name = userObj.displayName;
  } else {
    name = userObj.email.split("@")[0];
  }

  const [newDisplayName, setNewDisplayName] = useState(name);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/");
  };
  const getMyNweets = async () => {
    const nweets = await dbService
      .collection("nweets")
      .where("creatorId", "==", userObj.uid)
      .orderBy("createdAt")
      .get();
    console.log(nweets.docs.map((doc) => doc.data()));
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (name !== newDisplayName) {
      await userObj.updateProfile({
        displayName: newDisplayName,
      });
      refreshUser();
    }
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          onChange={onChange}
          type="text"
          autoFocus
          placeholder="Display name"
          value={newDisplayName}
        />
        <input
          type="submit"
          value="Update Profile"
          className="formBtn"
          style={{ marginTop: 10 }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
        Log Out
      </span>
    </div>
  );
};
