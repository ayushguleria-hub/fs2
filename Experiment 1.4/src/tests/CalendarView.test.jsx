import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import CalendarView from "../components/calendar/CalendarView";
import postsReducer from "../features/posts/postsSlice";

function createTestStore(posts = []) {
  return configureStore({
    reducer: {
      posts: postsReducer,
    },
    preloadedState: {
      posts: {
        posts,
      },
    },
  });
}

function renderCalendar(posts = [], props = {}) {
  const store = createTestStore(posts);

  render(
    <Provider store={store}>
      <CalendarView
        onCreatePost={vi.fn()}
        onEditPost={vi.fn()}
        {...props}
      />
    </Provider>
  );

  return store;
}

describe("CalendarView", () => {
  it("renders all weekdays", () => {
    renderCalendar();

    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Thu")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
    expect(screen.getByText("Sat")).toBeInTheDocument();
  });

  it("renders a scheduled post on the calendar", () => {
    renderCalendar([
      {
        id: 1,
        title: "Test Campaign",
        platform: "Instagram",
        date: "2026-08-12",
        time: "10:00",
        duration: 30,
        content: "Test content",
      },
    ]);

    expect(
      screen.getByText("Test Campaign")
    ).toBeInTheDocument();

    expect(
      screen.getByText(/10:00/)
    ).toBeInTheDocument();
  });

  it("opens the create form when a calendar day is clicked", async () => {
    const user = userEvent.setup();
    const onCreatePost = vi.fn();

    renderCalendar([], {
      onCreatePost,
    });

    const day = screen.getByText("12");

    await user.click(day);

    expect(onCreatePost).toHaveBeenCalled();
  });

  it("opens edit functionality when a post is clicked", async () => {
    const user = userEvent.setup();
    const onEditPost = vi.fn();

    renderCalendar(
      [
        {
          id: 1,
          title: "Test Campaign",
          platform: "Instagram",
          date: "2026-08-12",
          time: "10:00",
          duration: 30,
          content: "Test content",
        },
      ],
      {
        onEditPost,
      }
    );

    await user.click(
      screen.getByText("Test Campaign")
    );

    expect(onEditPost).toHaveBeenCalledWith(1);
  });

  it("does not count a render when unrelated parent state changes in optimized mode", async () => {
    const user = userEvent.setup();
    const onRender = vi.fn();
    const onCreatePost = vi.fn();
    const onEditPost = vi.fn();
    const onEventCalculation = vi.fn();

    function Harness() {
      const [count, setCount] = useState(0);

      return (
        <>
          <button onClick={() => setCount((value) => value + 1)}>
            bump
          </button>
          <CalendarView
            optimized
            onCreatePost={onCreatePost}
            onEditPost={onEditPost}
            onRender={onRender}
            onEventCalculation={onEventCalculation}
          />
          <span>{count}</span>
        </>
      );
    }

    const store = createTestStore([
      {
        id: 1,
        title: "Render Test",
        platform: "Instagram",
        date: "2026-08-12",
        time: "10:00",
        duration: 30,
        content: "Render test",
      },
    ]);

    render(
      <Provider store={store}>
        <Harness />
      </Provider>
    );

    expect(onRender).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole("button", { name: "bump" }));

    expect(onRender).toHaveBeenCalledTimes(1);
  });

  it("recalculates grouped events on every render in non-optimized mode", async () => {
    const user = userEvent.setup();
    const onEventCalculation = vi.fn();
    const onCreatePost = vi.fn();
    const onEditPost = vi.fn();

    function Harness() {
      const [count, setCount] = useState(0);

      return (
        <>
          <button onClick={() => setCount((value) => value + 1)}>
            bump
          </button>
          <CalendarView
            optimized={false}
            onCreatePost={onCreatePost}
            onEditPost={onEditPost}
            onEventCalculation={onEventCalculation}
          />
          <span>{count}</span>
        </>
      );
    }

    const store = createTestStore([
      {
        id: 1,
        title: "Recalc Test",
        platform: "Instagram",
        date: "2026-08-12",
        time: "10:00",
        duration: 30,
        content: "Recalc content",
      },
    ]);

    render(
      <Provider store={store}>
        <Harness />
      </Provider>
    );

    const initialCalls = onEventCalculation.mock.calls.length;

    expect(initialCalls).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "bump" }));

    expect(onEventCalculation).toHaveBeenCalledTimes(initialCalls + 1);
  });

  it("updates the post date after drag and drop", () => {
    const store = renderCalendar([
      {
        id: 1,
        title: "Drag Test",
        platform: "Instagram",
        date: "2026-08-12",
        time: "10:00",
        duration: 30,
        content: "Drag test",
      },
    ]);

    const post = screen.getByText("Drag Test");

    const dataTransfer = {
      effectAllowed: "",
      dropEffect: "",
      setData: vi.fn(),
      getData: vi.fn(() => "1"),
    };

    const dragStartEvent = new Event("dragstart", {
      bubbles: true,
    });

    Object.defineProperty(
      dragStartEvent,
      "dataTransfer",
      {
        value: dataTransfer,
      }
    );

    post.dispatchEvent(dragStartEvent);

    const targetDay = screen.getByText("20");

    const dropEvent = new Event("drop", {
      bubbles: true,
    });

    Object.defineProperty(
      dropEvent,
      "dataTransfer",
      {
        value: dataTransfer,
      }
    );

    Object.defineProperty(
      dropEvent,
      "preventDefault",
      {
        value: vi.fn(),
      }
    );

    targetDay
      .closest(".calendar-day")
      .dispatchEvent(dropEvent);

    const updatedPost = store
      .getState()
      .posts.posts.find(
        (item) => item.id === 1
      );

    expect(updatedPost.date).toBe("2026-08-20");
  });
});
