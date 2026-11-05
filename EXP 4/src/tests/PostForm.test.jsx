import { describe, expect, it, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import PostForm from "../components/PostForm/PostForm";
import postsReducer from "../features/posts/postsSlice";

function renderWithStore(ui) {
  const store = configureStore({
    reducer: {
      posts: postsReducer,
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        {ui}
      </Provider>
    ),
  };
}

describe("PostForm", () => {
  it("does not render when the form is closed", () => {
    renderWithStore(
      <PostForm
        isOpen={false}
        onClose={vi.fn()}
        editPostId={null}
        defaultDate={null}
      />
    );

    expect(
      screen.queryByText("Create Post")
    ).not.toBeInTheDocument();
  });

  it("renders the create form when opened", () => {
    renderWithStore(
      <PostForm
        isOpen={true}
        onClose={vi.fn()}
        editPostId={null}
        defaultDate="2026-08-15T10:00"
      />
    );

    expect(
      screen.getByText("Create Post")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Post Title")
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText("Date")
    ).toHaveValue("2026-08-15");

    expect(
      screen.getByLabelText("Time")
    ).toHaveValue("10:00");
  });

  it("allows the user to enter post data", async () => {
    const user = userEvent.setup();

    renderWithStore(
      <PostForm
        isOpen={true}
        onClose={vi.fn()}
        editPostId={null}
        defaultDate={null}
      />
    );

    const titleInput = screen.getByLabelText("Post Title");

    await user.type(titleInput, "New Campaign");

    expect(titleInput).toHaveValue("New Campaign");
  });

  it("creates a new post when the form is submitted", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    const { store } = renderWithStore(
      <PostForm
        isOpen={true}
        onClose={onClose}
        editPostId={null}
        defaultDate="2026-08-15T10:00"
      />
    );

    await user.type(
      screen.getByLabelText("Post Title"),
      "New Campaign"
    );

    await user.click(
      screen.getByRole("button", {
        name: "Schedule Post",
      })
    );

    const posts = store.getState().posts.posts;

    expect(posts.some(
      (post) => post.title === "New Campaign"
    )).toBe(true);

    expect(onClose).toHaveBeenCalled();
  });

  it("closes the form when cancel is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    renderWithStore(
      <PostForm
        isOpen={true}
        onClose={onClose}
        editPostId={null}
        defaultDate={null}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "Cancel",
      })
    );

    expect(onClose).toHaveBeenCalled();
  });
});