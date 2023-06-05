import "./App.css";
import Header from "./components/Header";
import InstagramLogo from "./assets/insta-logo.png";
import ImageUpload from "./UI/ImageUpload";
import Post from "./components/Post";
import { useEffect, useMemo, useState } from "react";
import { auth, db } from "./firebase";
import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import Modal from "@mui/material/Modal";
import { Button, Input, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function App() {
  console.log("APP Loading");
  // const collectionRef = collection(db, "posts");
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [signInError, setSignInError] = useState(false);
  const [loading, setLoading] = useState(false);

  const collectionRef = useMemo(() => {
    return collection(db, "posts");
  }, []);
  useEffect(() => {
    console.log("first");
    const unSubscribe = onAuthStateChanged(auth, (authuser) => {
      if (authuser) {
        //user has logged in
        // console.log(authuser);
        setUser(authuser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unSubscribe();
    };
  }, [user]);

  useEffect(() => {
    console.log("second");
    const postsQuery = query(collectionRef, orderBy("timestamp", "desc"));
    const unsub = onSnapshot(postsQuery, (querySnapshort) => {
      const postItems = [];
      querySnapshort.forEach((doc) => {
        postItems.push({ id: doc.id, post: doc.data() });
      });
      // console.log("postItems", postItems);
      setPosts(postItems);
    });
    return () => {
      unsub();
    };
  }, [collectionRef]);

  // const signupHandler = (e) => {
  //   e.preventDefault();
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((authUser) => {
  //       return updateProfile(authUser.user, { displayName: username });
  //     })
  //     .catch((error) => alert(error.message));
  //   setOpen(false);
  //   setEmail("");
  //   setPassword("");
  //   setUsername("");
  // };
  const signupHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then((authUser) => {
        return updateProfile(authUser.user, {
          displayName: username,
        }).then(() => {
          // Set the current user with displayName in the state
          setLoading(false);
          setOpen(false);
          setEmail("");
          setPassword("");
          setUsername("");
          setUser({
            ...authUser.user,
            displayName: username,
          });
        });
      })
      .catch((error) => {
        // alert(error.message)
        if (error) {
          console.log("error");
          setSignInError(true);
          setLoading(false);
        }
      });
    // setOpen(false);
    // setEmail("");
    // setPassword("");
    // setUsername("");
  };

  const signinHandler = (e) => {
    e.preventDefault();
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        setOpenSignIn(false);
        setSignInError(false);
        setEmail("");
        setPassword("");
        setLoading(false);
      })
      .catch((err) => {
        // alert(err.messgae);
        if (err) {
          console.log("error");
          setSignInError(true);
          setLoading(false);
        }
      });
  };
  const handleSignInOverlayClick = () => {
    setOpenSignIn(false);
    setSignInError(false);
    setEmail("");
    setPassword("");

    setOpen(false);
    setUsername("");
  };

  return (
    <div className="app">
      <Modal
        onBackdropClick={handleSignInOverlayClick}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src={InstagramLogo}
                alt="instagram-logo"
              />
            </center>
            <TextField
              type="text"
              label="UserName"
              sx={{
                marginBottom: "20px",
                marginTop: "25px",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              type="text"
              label="Email"
              helperText="The email should follow the standard format (e.g.example@example.com)"
              sx={{
                marginBottom: "20px",
                marginTop: "20px",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              label="Password"
              helperText="Enter atleast 6 Characters"
              sx={{
                marginBottom: "20px",
                marginTop: "20px",
              }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {signInError ? (
              <div className="errorMsg">
                Please Enter Valid Email and Password
              </div>
            ) : (
              ""
            )}
            {loading ? (
              <div className="loading" id="hideMeAfter1Seconds">
                Please Wait !!!
              </div>
            ) : (
              ""
            )}
            <Button
              className="btns"
              type="submit"
              onClick={signupHandler}
              variant="contained"
              disabled={
                email.trim() === "" ||
                password.trim() === "" ||
                loading ||
                username.trim() === ""
                  ? true
                  : false
              }
            >
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
          </form>
        </Box>
      </Modal>
      <Modal
        onBackdropClick={handleSignInOverlayClick}
        open={openSignIn}
        onClose={() => {
          setOpenSignIn(false);
        }}
      >
        <Box sx={style}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src={InstagramLogo}
                alt="instagram-logo"
              />
            </center>
            <TextField
              type="text"
              label="Email"
              sx={{
                marginBottom: "20px",
                marginTop: "25px",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              type="password"
              sx={{
                marginBottom: "20px",
                marginTop: "20px",
              }}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {signInError ? (
              <div className="errorMsg">
                Please Enter Valid Email and Password
              </div>
            ) : (
              ""
            )}
            {loading ? (
              <div className="loading" id="hideMeAfter1Seconds">
                Please Wait !!!
              </div>
            ) : (
              ""
            )}
            <Button
              className="btns"
              type="submit"
              onClick={signinHandler}
              disabled={
                email.trim() === "" || password.trim() === "" || loading
                  ? true
                  : false
              }
              variant="contained"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Box>
      </Modal>
      <Header username={user?.displayName} />
      {user ? (
        <div className="app__signInSignUpButtton">
          <Button
            variant="contained"
            onClick={() => signOut(auth).catch((err) => alert(err.message))}
          >
            LogOut
          </Button>
        </div>
      ) : (
        <div className="app__signInSignUpButtton">
          <Button variant="contained" onClick={() => setOpenSignIn(true)}>
            Sign In
          </Button>
          <Button variant="contained" onClick={() => setOpen(true)}>
            Sign Up
          </Button>
        </div>
      )}
      {user ? (
        <div className="app__logInMsg" id="hideMeAfter5Seconds">
          <h2>Succeefully Logged In !!!</h2>
        </div>
      ) : (
        ""
      )}
      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map((postObj) => (
            <Post
              user={user}
              key={postObj.id}
              postId={postObj.id}
              username={postObj.post.username}
              caption={postObj.post.caption}
              image={postObj.post.image}
            />
          ))}
        </div>
        <div className="app__postsRight">
          {user ? (
            <ImageUpload username={user.displayName} />
          ) : (
            <h2 className="app__signInDisplay">
              Please Sign In or Sign Up to Upload Posts and Comment.
            </h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

//DUMMY_DATA
// {
//   username: "Deepak kalirawna",
//   caption:
//     "you will never know the value of moment until it becomes a memory😇😇😇",
//   image:
//     "https://www.freecodecamp.org/news/content/images/size/w2000/2020/02/Ekran-Resmi-2019-11-18-18.08.13.png",
// },
// {
//   username: "Ashish Grover",
//   caption: "I took this picture 10 years ago.. 💚💚💚💚",
//   image:
//     "https://images.pexels.com/photos/36717/amazing-animal-beautiful-beautifull.jpg?cs=srgb&dl=pexels-pixabay-36717.jpg&fm=jpg",
// },
// {
//   username: "Parvesh Bansal",
//   caption: "Always there enjoing life 🎃🎃🎃🎃",
//   image: "https://wallpapers.com/images/featured/a5u9zq0a0ymy2dug.jpg",
// },
// {
//   username: "Maji Manish",
//   caption: "well done great job!! 🏆🏆✈️✈️",
//   image:
//     "https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832__340.jpg",
// },
