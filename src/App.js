import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import { db, auth } from './firebase';
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  /* setting states; short term memory for react */
  const [modalStyle] = useState(getModalStyle);
  const [posts, setPosts] = useState([/* static posts here*/ ]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');           
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);         // logged in user

  useEffect(() => {
    // happens when any authentication change occurs like login/logout/signup
    const unsubscribe = auth.onAuthStateChanged((authUser) => {   // state is not persistent, but this function keeps us logged in
      if(authUser) {
        // user has logged in
        console.log(authUser);
        setUser(authUser);
      }
      else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions before refiring useEffect
      unsubscribe()   // detach the listener after he logs in and then refire useEffect
    }

  }, [user, username]);

  // useEffect runs a piece of code based on specific conditions
  useEffect(() => {
    // code to run
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      // everytime a new post is added, this code fires; onSnapshot is a listener as name suggests
      // firebase features below to fetch data from firebase
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, 
        post: doc.data()
      })));
    })
  }, [])    // conditions as variables
  // blank is run once when app component loads; on condition, it will load whenever changes occur there on the condition

  const signUp = (event) => {
    event.preventDefault();

    auth
    .createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      });
    })
    .catch((error) => alert(error.message))
  }

  const signIn = (event) => {
    event.preventDefault();

    auth
    .signInWithEmailAndPassword(email, password)
    .catch((error) => alert(error.message))

    setOpenSignIn(false)
  }

  return (
    <div className="app">
      <Modal
        open = {open}
        onClose = {() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />    
            </center>

            <Input placeholder="Username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open = {openSignIn}
        onClose = {() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
              <img
                className="app_headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""
              />    
            </center>

            <Input placeholder="Email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app_header">
        <img
          className="app_headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt=""
        />

        {user ? (
          <Button onClick={() => auth.signOut()}>Log out</Button>
        ): /* or */(
          <div className="app_loginContainer">
            <Button onClick={() => setOpen(true)}>Sign up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          </div>
        )}
      </div>

      <div className="app_posts">
        <div className="app_postsLeft">
          {
            posts.map(({id, post}) => (
              // looping through all the posts above
              // after adding key, react now knows which post to refresh instead of refreshing the whole page
              // passing postId to know on which post to comment
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app_postsRight">
          {/* instagram embed feature */}
          <InstagramEmbed
            url = 'https://instagr.am/p/Zw9o4'
            maxWidth = {320}
            hideCaption = {false}
            containerTagName = 'div'
            protocol = ''
            injectScript
            onLoading = {() => {}}
            onSuccess = {() => {}}
            onAfterRender = {() => {}}
            onFailure = {() => {}}
          />
        </div>
      </div>

      {/* caption input -> file picking -> post button */}
      {user?.displayName ? (
        <ImageUpload username={user.displayName} />  
      ): (
        <h3>You need to login to upload posts</h3>
      )}

      {/* <Post username="Satyam" caption="Working" imageUrl="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__340.jpg" /> */}
      {/* <Post username="Krish" caption="Noice" imageUrl="https://i.pinimg.com/originals/ca/76/0b/ca760b70976b52578da88e06973af542.jpg" /> */}
      {/* <Post username="Sid" caption="Working" imageUrl="https://static.toiimg.com/photo/72975551.cms" /> */}

    </div>
  );
}

export default App;