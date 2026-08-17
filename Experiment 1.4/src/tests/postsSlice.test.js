import { describe, expect, it } from "vitest";
import reducer, {
  addPost,
  updatePost,
  deletePost,
  movePost,
} from "../features/posts/postsSlice";

describe("postsSlice", () => {
  const initialState = {
    posts: [
      {
        id: 1,
        title: "Test Post",
        platform: "Instagram",
        date: "2026-08-12",
        time: "10:00",
        duration: 30,
        content: "Test content",
      },
    ],
  };

  it("adds a new post", () => {
    const newPost = {
      id: 2,
      title: "New Post",
      platform: "LinkedIn",
      date: "2026-08-13",
      time: "12:00",
      duration: 30,
      content: "New content",
    };

    const state = reducer(initialState, addPost(newPost));

    expect(state.posts).toHaveLength(2);
    expect(state.posts[1]).toEqual(newPost);
  });

  it("updates an existing post", () => {
    const state = reducer(
      initialState,
      updatePost({
        id: 1,
        changes: {
          title: "Updated Post",
          time: "15:00",
        },
      })
    );

    expect(state.posts[0].title).toBe("Updated Post");
    expect(state.posts[0].time).toBe("15:00");
  });

  it("deletes a post", () => {
    const state = reducer(initialState, deletePost(1));

    expect(state.posts).toHaveLength(0);
  });

  it("moves a post to another date and time", () => {
    const state = reducer(
      initialState,
      movePost({
        id: 1,
        date: "2026-08-20",
        time: "16:00",
      })
    );

    expect(state.posts[0].date).toBe("2026-08-20");
    expect(state.posts[0].time).toBe("16:00");
  });
});