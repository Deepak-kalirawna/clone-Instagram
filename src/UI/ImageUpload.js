import "./ImageUpload.css";
import React, { useState } from "react";
import { db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Button, Input, TextField } from "@mui/material";

function ImageUpload(props) {
  const [image, setImage] = useState(null);
  const [progres, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState(false);
  const collectionRef = collection(db, "posts");

  const handlerChange = (e) => {
    if (e.target.files[0]) {
      console.log(e.target.files[0]);
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const storageRef = ref(storage, `images/${image.name}`);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        console.log("Upload is " + progress + "% done");
        setProgress(progress);
      },
      (error) => {
        console.log(error.message);
        // alert(error.message);
        if (error) {
          setError(true);
        }
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log("File available at", url);
          addDoc(collectionRef, {
            timestamp: serverTimestamp(),
            caption: caption,
            image: url,
            username: props.username,
          });
          setCaption("");
          setImage(null);
          setProgress(0);
        });
      }
    );
  };
  return (
    <div className="imageUpload">
      <progress className="imageUpload__progress" value={progres} max="100" />
      {/* <input
        type="text"
        placeholder="Enter a caption..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      /> */}
      <TextField
        label="Caption"
        helperText={caption.trim() == "" ? "Enter a caption for Post" : ""}
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <div className="imageUpload__fileInput">
        <Input
          type="file"
          name="file"
          id="file"
          className="inputfile"
          onChange={handlerChange}
        />
      </div>
      {error ? "Something went wrong! Please try again..." : ""}
      <Button
        className="imageUploader__button"
        variant="contained"
        color="success"
        onClick={handleUpload}
        disabled={caption.trim() != "" && image ? false : true}
      >
        {" "}
        Upload
      </Button>
    </div>
  );
}

export default ImageUpload;
