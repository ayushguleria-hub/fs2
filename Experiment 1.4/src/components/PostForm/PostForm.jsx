import { memo, useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
  addPost,
  updatePost,
} from "../../features/posts/postsSlice";
import "./PostForm.css";

function PostForm({
  isOpen,
  onClose,
  editPostId,
  defaultDate,
}) {
  const dispatch = useAppDispatch();

  const posts = useAppSelector((state) => state.posts.posts);

  const editingPost = posts.find(
    (post) => post.id === editPostId
  );

  const [formData, setFormData] = useState({
    title: "",
    platform: "Instagram",
    date: "",
    time: "09:00",
    duration: "30",
    content: "",
  });

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (editingPost) {
      setFormData({
        title: editingPost.title || "",
        platform: editingPost.platform || "Instagram",
        date: editingPost.date || "",
        time: editingPost.time || "09:00",
        duration: String(editingPost.duration || 30),
        content: editingPost.content || "",
      });

      return;
    }

    let date = "";
    let time = "09:00";

    if (defaultDate) {
      const parts = defaultDate.split("T");

      date = parts[0] || "";
      time = parts[1] || "09:00";
    }

    setFormData({
      title: "",
      platform: "Instagram",
      date,
      time,
      duration: "30",
      content: "",
    });
  }, [isOpen, editingPost, defaultDate]);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }, []);

  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (!formData.title.trim() || !formData.date) {
        return;
      }

      const postData = {
        ...formData,
        title: formData.title.trim(),
        duration: Number(formData.duration),
      };

      if (editingPost) {
        dispatch(
          updatePost({
            id: editingPost.id,
            changes: postData,
          })
        );
      } else {
        dispatch(
          addPost({
            ...postData,
            id: Date.now(),
          })
        );
      }

      onClose();
    },
    [dispatch, editingPost, formData, onClose]
  );

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="post-form-overlay">
      <div className="post-form-container">
        <div className="post-form-header">
          <h2>
            {editingPost
              ? "Edit Scheduled Post"
              : "Create Post"}
          </h2>

          <button
            type="button"
            onClick={handleCancel}
            className="close-button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">
              Post Title
            </label>

            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="platform">
              Platform
            </label>

            <select
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
            >
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Twitter">Twitter</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">
                Date
              </label>

              <input
                id="date"
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">
                Time
              </label>

              <input
                id="time"
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="duration">
              Duration (minutes)
            </label>

            <input
              id="duration"
              type="number"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">
              Content
            </label>

            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your post content..."
              rows="5"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>

            <button type="submit">
              {editingPost
                ? "Update Post"
                : "Schedule Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default memo(PostForm);