import React, { useEffect, useState } from "react";
import Avatar from "@mui/material/Avatar";
import "./Post.css";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
function Post({ postId, username, caption, image, user }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  console.log("loadced");
  useEffect(() => {
    let unSubscribe;
    if (postId) {
      let collectionRef = collection(db, "posts", postId, "comments");
      unSubscribe = onSnapshot(collectionRef, (querySnapshort) => {
        let items = [];
        querySnapshort.forEach((doc) => {
          items.push(doc.data());
        });
        setComments(items);
      });
    }
    return () => {
      // unSubscribe();
    };
  }, []);
  const postComment = (e) => {
    e.preventDefault();
    let collectionRef = collection(db, "posts", postId, "comments");
    addDoc(collectionRef, {
      timestamp: serverTimestamp(),
      text: comment,
      username: user.displayName,
    });
    setComment("");
    console.log(comments);
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar className="post__avatar" alt={username} src={image} />
        <h3>{username}</h3>
      </div>
      <img className="post__image" alt="react-logo" src={image} />
      <h4 className="post__text">
        <strong>{username} : </strong>
        {caption}
      </h4>
      <div className="post__comments">
        {comments.map((comment) => {
          return (
            <p>
              <strong>{comment.username} : </strong>
              {comment.text}
            </p>
          );
        })}
      </div>
      {user && (
        <form className="post__commentBox">
          <input
            className="post__input"
            type="text"
            placeholder="Add a comment ..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button
            className="post__button"
            type="submit"
            disabled={!comment}
            onClick={postComment}
          >
            Post
          </button>
        </form>
      )}
    </div>
  );
}

export default Post;
