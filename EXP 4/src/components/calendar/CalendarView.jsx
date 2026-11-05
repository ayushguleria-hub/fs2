import {
  memo,
  useCallback,
  useMemo,
  useEffect,
  useState,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/reduxHooks";

import { updatePost } from "../../features/posts/postsSlice";

import {
  formatDateKey,
  getMonthDays,
  groupPostsByDate,
} from "../../utils/calendarUtils";

import "./CalendarView.css";

const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

/* =========================================================
   CALENDAR EVENT
========================================================= */

const PlainCalendarEvent = function CalendarEvent({
  post,
  onEditPost,
  onDragStart,
}) {
  return (
    <div
      className="calendar-event"
      draggable
      onDragStart={(event) =>
        onDragStart(event, post)
      }
      onClick={(event) => {
        event.stopPropagation();
        onEditPost(post.id);
      }}
    >
      <strong>{post.title}</strong>

      <span>
        {post.time} • {post.platform}
      </span>
    </div>
  );
};

const MemoizedCalendarEvent =
  memo(PlainCalendarEvent);

/* =========================================================
   CALENDAR VIEW
========================================================= */

function CalendarViewInner({
  optimized = true,
  onCreatePost,
  onEditPost,
  onRender,
  onEventCalculation,
}) {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(
    (state) => state.posts.posts
  );

  const [currentDate, setCurrentDate] =
    useState(new Date());

  const [draggedPostId, setDraggedPostId] =
    useState(null);

  /* -------------------------------------------------------
     RENDER COUNTER
  ------------------------------------------------------- */

  useEffect(() => {
    onRender?.();
  });

  /* =======================================================
     MONTH DAYS
  ======================================================= */

  const memoizedMonthDays = useMemo(() => {
    return getMonthDays(currentDate);
  }, [currentDate]);

  const monthDays = optimized
    ? memoizedMonthDays
    : getMonthDays(currentDate);

  /* =======================================================
     POSTS BY DATE
  ======================================================= */

  /*
    PURE CALCULATION.

    There is NO setState or callback here.

    This is important because useMemo should be used
    for calculating a value, not for causing side effects.
  */

  const memoizedPostsByDate = useMemo(() => {
    return groupPostsByDate(posts);
  }, [posts]);

  /*
    Count the calculation AFTER rendering/calculation.

    This prevents:

        render
          ↓
        setState
          ↓
        render
          ↓
        setState

    loops.
  */

  useEffect(() => {
    if (optimized) {
      onEventCalculation?.();
    }
  }, [optimized, posts, onEventCalculation]);

  useEffect(() => {
    if (!optimized) {
      onEventCalculation?.();
    }
  });

  const postsByDate = optimized
    ? memoizedPostsByDate
    : groupPostsByDate(posts);

  /* =======================================================
     MONTH TITLE
  ======================================================= */

  const memoizedMonthTitle = useMemo(() => {
    return currentDate.toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric",
      }
    );
  }, [currentDate]);

  const monthTitle = optimized
    ? memoizedMonthTitle
    : currentDate.toLocaleDateString(
        "en-US",
        {
          month: "long",
          year: "numeric",
        }
      );

  /* =======================================================
     NAVIGATION CALLBACKS
  ======================================================= */

  const memoizedGoToPreviousMonth =
    useCallback(() => {
      setCurrentDate((previousDate) => {
        return new Date(
          previousDate.getFullYear(),
          previousDate.getMonth() - 1,
          1
        );
      });
    }, []);

  const memoizedGoToNextMonth =
    useCallback(() => {
      setCurrentDate((previousDate) => {
        return new Date(
          previousDate.getFullYear(),
          previousDate.getMonth() + 1,
          1
        );
      });
    }, []);

  const memoizedGoToToday =
    useCallback(() => {
      setCurrentDate(new Date());
    }, []);

  /* =======================================================
     DRAG FUNCTIONS
  ======================================================= */

  const memoizedHandleDragStart =
    useCallback((event, post) => {
      setDraggedPostId(post.id);

      event.dataTransfer.effectAllowed =
        "move";

      event.dataTransfer.setData(
        "text/plain",
        String(post.id)
      );
    }, []);

  const memoizedHandleDragOver =
    useCallback((event) => {
      event.preventDefault();

      event.dataTransfer.dropEffect =
        "move";
    }, []);

  const memoizedHandleDrop =
    useCallback(
      (event, targetDate) => {
        event.preventDefault();

        const postId =
          draggedPostId ||
          Number(
            event.dataTransfer.getData(
              "text/plain"
            )
          );

        if (!postId || !targetDate) {
          setDraggedPostId(null);
          return;
        }

        const post = posts.find(
          (item) => item.id === postId
        );

        if (!post) {
          setDraggedPostId(null);
          return;
        }

        dispatch(
          updatePost({
            id: postId,
            changes: {
              date: formatDateKey(targetDate),
            },
          })
        );

        setDraggedPostId(null);
      },
      [dispatch, draggedPostId, posts]
    );

  /* =======================================================
     DAY CLICK
  ======================================================= */

  const memoizedHandleDayClick =
    useCallback(
      (date) => {
        if (!date) return;

        onCreatePost(
          formatDateKey(date),
          true
        );
      },
      [onCreatePost]
    );

  /* =======================================================
     TODAY CHECK
  ======================================================= */

  const memoizedIsToday =
    useCallback((date) => {
      if (!date) return false;

      const today = new Date();

      return (
        today.getFullYear() ===
          date.getFullYear() &&
        today.getMonth() ===
          date.getMonth() &&
        today.getDate() ===
          date.getDate()
      );
    }, []);

  /* =======================================================
     OPTIMIZED / NON-OPTIMIZED FUNCTIONS
  ======================================================= */

  const goToPreviousMonth = optimized
    ? memoizedGoToPreviousMonth
    : () => {
        setCurrentDate((previousDate) => {
          return new Date(
            previousDate.getFullYear(),
            previousDate.getMonth() - 1,
            1
          );
        });
      };

  const goToNextMonth = optimized
    ? memoizedGoToNextMonth
    : () => {
        setCurrentDate((previousDate) => {
          return new Date(
            previousDate.getFullYear(),
            previousDate.getMonth() + 1,
            1
          );
        });
      };

  const goToToday = optimized
    ? memoizedGoToToday
    : () => {
        setCurrentDate(new Date());
      };

  const handleDragStart = optimized
    ? memoizedHandleDragStart
    : (event, post) => {
        setDraggedPostId(post.id);

        event.dataTransfer.effectAllowed =
          "move";

        event.dataTransfer.setData(
          "text/plain",
          String(post.id)
        );
      };

  const handleDragOver = optimized
    ? memoizedHandleDragOver
    : (event) => {
        event.preventDefault();

        event.dataTransfer.dropEffect =
          "move";
      };

  const handleDrop = optimized
    ? memoizedHandleDrop
    : (event, targetDate) => {
        event.preventDefault();

        const postId =
          draggedPostId ||
          Number(
            event.dataTransfer.getData(
              "text/plain"
            )
          );

        if (!postId || !targetDate) {
          setDraggedPostId(null);
          return;
        }

        const post = posts.find(
          (item) => item.id === postId
        );

        if (!post) {
          setDraggedPostId(null);
          return;
        }

        dispatch(
          updatePost({
            id: postId,
            changes: {
              date: formatDateKey(targetDate),
            },
          })
        );

        setDraggedPostId(null);
      };

  const handleDayClick = optimized
    ? memoizedHandleDayClick
    : (date) => {
        if (!date) return;

        onCreatePost(
          formatDateKey(date),
          true
        );
      };

  const isToday = optimized
    ? memoizedIsToday
    : (date) => {
        if (!date) return false;

        const today = new Date();

        return (
          today.getFullYear() ===
            date.getFullYear() &&
          today.getMonth() ===
            date.getMonth() &&
          today.getDate() ===
            date.getDate()
        );
      };

  /* =======================================================
     EVENT COMPONENT
  ======================================================= */

  const EventComponent = optimized
    ? MemoizedCalendarEvent
    : PlainCalendarEvent;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="calendar-section">

      {/* ================= HEADER ================= */}

      <div className="calendar-header">

        <div className="calendar-title">

          <button
            onClick={goToPreviousMonth}
          >
            ‹
          </button>

          <h2>{monthTitle}</h2>

          <button
            onClick={goToNextMonth}
          >
            ›
          </button>

          <button
            className="today-button"
            onClick={goToToday}
          >
            Today
          </button>

        </div>

        <button
          className="create-calendar-button"
          onClick={() => onCreatePost()}
        >
          + Create Post
        </button>

      </div>

      {/* ================= CALENDAR ================= */}

      <div className="calendar-grid">

        {/* WEEK DAYS */}

        {WEEK_DAYS.map((day) => (
          <div
            className="calendar-weekday"
            key={day}
          >
            {day}
          </div>
        ))}

        {/* CALENDAR DAYS */}

        {monthDays.map((date, index) => {

          const dateKey = date
            ? formatDateKey(date)
            : null;

          const dayPosts = dateKey
            ? postsByDate[dateKey] || []
            : [];

          return (
            <div
              className={`calendar-day ${
                date && isToday(date)
                  ? "today"
                  : ""
              } ${
                !date
                  ? "empty-day"
                  : ""
              }`}
              key={
                date
                  ? dateKey
                  : `empty-${index}`
              }
              onClick={() =>
                handleDayClick(date)
              }
              onDragOver={
                date
                  ? handleDragOver
                  : undefined
              }
              onDrop={
                date
                  ? (event) =>
                      handleDrop(
                        event,
                        date
                      )
                  : undefined
              }
            >

              {date && (
                <>

                  <div className="day-number">
                    {date.getDate()}
                  </div>

                  <div className="day-events">

                    {dayPosts.map(
                      (post) => (
                        <EventComponent
                          key={post.id}
                          post={post}
                          onEditPost={
                            onEditPost
                          }
                          onDragStart={
                            handleDragStart
                          }
                        />
                      )
                    )}

                  </div>

                </>
              )}

            </div>
          );
        })}

      </div>

    </section>
  );
}

/*
  React.memo prevents CalendarView from rendering
  when its props haven't changed.
*/

const MemoizedCalendarView = memo(
  CalendarViewInner
);

function CalendarView(props) {
  if (props.optimized === false) {
    return <CalendarViewInner {...props} />;
  }

  return <MemoizedCalendarView {...props} />;
}

export default CalendarView;
