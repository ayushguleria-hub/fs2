import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { decodeToken, logout } from "./auth";
import { users } from "./users";

function Dashboard({ onLogout }) {
  const token = decodeToken();
  const currentUser = users.find((u) => u.id === token?.id);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [posts, setPosts] = useState([]);
  const postStorageKey = "posts_all";

  useEffect(() => {
    // require a logged-in user to view posts
    if (!currentUser) return;

    const stored = localStorage.getItem(postStorageKey);
    if (stored) {
      try {
        setPosts(JSON.parse(stored));
      } catch {
        setPosts([]);
      }
    }
  }, [postStorageKey, currentUser]);

  const savePosts = (nextPosts) => {
    setPosts(nextPosts);
    localStorage.setItem(postStorageKey, JSON.stringify(nextPosts));
  };

  const handleCreatePost = (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter both a title and content for the post.");
      return;
    }

    const newPost = {
      id: Date.now(),
      title: title.trim(),
      content: content.trim(),
      createdAt: new Date().toLocaleString(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorRole: currentUser.role,
    };

    savePosts([newPost, ...posts]);
    setTitle("");
    setContent("");
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setEditingTitle(post.title);
    setEditingContent(post.content);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editingTitle.trim() || !editingContent.trim()) {
      alert("Please enter both a title and content for the post.");
      return;
    }
    const next = posts.map((p) => (p.id === editingPostId ? { ...p, title: editingTitle.trim(), content: editingContent.trim(), updatedAt: new Date().toLocaleString() } : p));
    savePosts(next);
    setEditingPostId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  const handleCancelEdit = () => {
    setEditingPostId(null);
    setEditingTitle("");
    setEditingContent("");
  };

  const handleDelete = (id) => {
    if (!currentUser || currentUser.role !== "Admin") {
      alert("Only Admins can delete posts.");
      return;
    }
    if (!window.confirm("Delete this post?")) return;
    const next = posts.filter((p) => p.id !== id);
    savePosts(next);
  };

  if (!currentUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>
        <h2>Invalid session</h2>
        <p>Please log in again.</p>
      </div>
    );
  }

  const role = currentUser.role;
  const rolePaths = {
    Admin: "/admin",
    Editor: "/editor",
    Viewer: "/viewer",
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px", maxWidth: "640px", marginLeft: "auto", marginRight: "auto" }}>
      <h2>Dashboard</h2>
      <h3>Welcome, {currentUser.name}</h3>
      <hr />
      <p><strong>Role:</strong> {role || "N/A"}</p>
      <p><strong>Employee ID:</strong> {currentUser.id}</p>
      <p><strong>Username:</strong> {currentUser.username}</p>
      <p><strong>Designation:</strong> {currentUser.designation}</p>
      <p><strong>Department:</strong> {currentUser.department}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Phone:</strong> {currentUser.phone}</p>
      {rolePaths[role] && (
        <div style={{ marginTop: "24px" }}>
          <Link to={rolePaths[role]} style={{ marginRight: "16px" }}>
            Go to {role} Area
          </Link>
          <Link to="/unauthorized">Unauthorized Example</Link>
        </div>
      )}

      <section style={{ marginTop: "32px", textAlign: "left" }}>
        <h3>Create a Post</h3>
        {role === "Viewer" ? (
          <p>Viewers cannot create posts.</p>
        ) : (
          <form onSubmit={handleCreatePost}>
            <label style={{ display: "block", marginBottom: "12px" }}>
              Title
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "8px" }}
                placeholder="Post title"
              />
            </label>

            <label style={{ display: "block", marginBottom: "12px" }}>
              Content
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{ width: "100%", padding: "8px", marginTop: "8px", minHeight: "100px" }}
                placeholder="Write your post here"
              />
            </label>

            <button type="submit" style={{ padding: "10px 18px" }}>
              Publish Post
            </button>
          </form>
        )}
      </section>

      <section style={{ marginTop: "32px", textAlign: "left" }}>
        <h3>Your Posts</h3>
        {posts.length === 0 ? (
          <p>No posts yet. Create your first post above.</p>
        ) : (
          posts.map((post) => (
            <article key={post.id} style={{ border: "1px solid #ccc", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
              {editingPostId === post.id ? (
                <form onSubmit={handleSaveEdit}>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Title
                    <input value={editingTitle} onChange={(e) => setEditingTitle(e.target.value)} style={{ width: "100%", padding: "6px", marginTop: "6px" }} />
                  </label>
                  <label style={{ display: "block", marginBottom: "8px" }}>
                    Content
                    <textarea value={editingContent} onChange={(e) => setEditingContent(e.target.value)} style={{ width: "100%", padding: "6px", marginTop: "6px" }} />
                  </label>
                  <div style={{ marginTop: "8px" }}>
                    <button type="submit" style={{ marginRight: "8px", padding: "8px 12px" }}>Save</button>
                    <button type="button" onClick={handleCancelEdit} style={{ padding: "8px 12px" }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <>
                  <h4 style={{ margin: "0 0 8px" }}>{post.title}</h4>
                  <p style={{ margin: "0 0 12px" }}>{post.content}</p>
                  <small>Created: {post.createdAt}{post.updatedAt ? ` • Updated: ${post.updatedAt}` : ""}</small>
                  <div style={{ marginTop: "8px" }}>
                    {(role === "Admin" || role === "Editor") && (
                      <button onClick={() => handleEditClick(post)} style={{ marginRight: "8px", padding: "6px 10px" }}>
                        Edit
                      </button>
                    )}
                    {role === "Admin" && (
                      <button onClick={() => handleDelete(post.id)} style={{ padding: "6px 10px" }}>
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </article>
          ))
        )}
      </section>

      <div style={{ marginTop: "24px" }}>
        <button
          onClick={() => {
            logout();
            onLogout();
          }}
          style={{ padding: "10px 18px" }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;