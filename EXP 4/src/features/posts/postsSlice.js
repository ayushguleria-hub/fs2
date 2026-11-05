import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [
    {
      id: 1,
      title: "Instagram Campaign",
      platform: "Instagram",
      date: "2026-08-12",
      time: "10:00",
      duration: 30,
      content: "Launch the new product campaign.",
    },
    {
      id: 2,
      title: "LinkedIn Update",
      platform: "LinkedIn",
      date: "2026-08-14",
      time: "14:00",
      duration: 30,
      content: "Share the latest company update.",
    },
  ],
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },

    updatePost: (state, action) => {
      const { id, changes } = action.payload;

      const post = state.posts.find(
        (item) => item.id === id
      );

      if (post) {
        Object.assign(post, changes);
      }
    },

    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (post) => post.id !== action.payload
      );
    },

    movePost: (state, action) => {
      const { id, date, time } = action.payload;

      const post = state.posts.find(
        (item) => item.id === id
      );

      if (post) {
        post.date = date;

        if (time !== undefined) {
          post.time = time;
        }
      }
    },
  },
});

export const {
  addPost,
  updatePost,
  deletePost,
  movePost,
} = postsSlice.actions;

export default postsSlice.reducer;