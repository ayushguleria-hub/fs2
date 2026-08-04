import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addPost, deletePost } from "./postsSlice";
import "./App.css";

function App() {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts.posts);

  const [title, setTitle] = useState("");

  const [platform, setPlatform] = useState("Instagram");

  const characterLimits = {
    Instagram: 2200,
    LinkedIn: 3000,
    Twitter: 280,
    Facebook: 63206,
  };

  const getEmoji = (platform) => {
    switch (platform) {
      case "Instagram":
        return " ";

      case "LinkedIn":
        return " ";

      case "Twitter":
        return " ";

      case "Facebook":
        return " ";

      default:
        return " ";
    }
  };

  const handleAddPost = () => {
    if (title.trim() === "") {
      alert("Please enter a post!");
      return;
    }

    if (title.length > characterLimits[platform]) {
      alert(
        `${platform} allows only ${characterLimits[platform]} characters.`
      );
      return;
    }
    

    dispatch(
      addPost({
        id: Date.now(),
        title,
        platform,
        date: new Date().toLocaleDateString(),
      })
    );

    setTitle("");
    setPlatform("Instagram");
  };

  return (
    <div className="container">
      <div className="card">

        <h1> Social Media Post Manager</h1>

        <p className="subtitle">
          Redux Toolkit CRUD Application
        </p>

        <div className="counter">
          Total Posts :
          <span> {posts.length}</span>
        </div>

        <div className="form">

          <textarea
            placeholder={`Write your ${platform} post...`}
            value={title}
            maxLength={characterLimits[platform]}
            rows="5"
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="char-counter">
            {title.length} / {characterLimits[platform]}
          </div>

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
          >
            <option>Instagram</option>
            <option>LinkedIn</option>
            <option>Twitter</option>
            <option>Facebook</option>
          </select>

          <button onClick={handleAddPost}>
            ➕ Add Post
          </button>

        </div>

        <div className="posts">

          {posts.length === 0 ? (
            <div className="empty">
              No posts available.
            </div>
          ) : (
            posts.map((post) => (
              <div className="post-card" key={post.id}>

                <div className="left">

                  <h3>
                    {getEmoji(post.platform)} {post.platform}
                  </h3>

                  <p>{post.title}</p>

                  <small>
                    Created : {post.date}
                  </small>

                </div>

                <button
                  className="delete-btn"
                  onClick={() =>
                    dispatch(deletePost(post.id))
                  }
                >
                  🗑 Delete
                </button>

              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}

export default App;