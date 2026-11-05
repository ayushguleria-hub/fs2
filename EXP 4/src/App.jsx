import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useAppSelector,
} from "./hooks/reduxHooks";

import CalendarView from "./components/calendar/CalendarView";
import PostForm from "./components/PostForm/PostForm";
import PostList from "./components/PostList/PostList";
import PerformanceMonitor from "./components/PerformanceMonitor/PerformanceMonitor";

import "./App.css";

/* =========================================================
   APP
========================================================= */

function App() {

  /* =======================================================
     FORM STATE
  ======================================================= */

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [editPostId, setEditPostId] =
    useState(null);

  const [defaultDate, setDefaultDate] =
    useState(null);

  /* =======================================================
     OPTIMIZATION STATE
  ======================================================= */

  /*
    This controls whether the application uses:

    Optimized:
      React.memo
      useMemo
      useCallback

    Non-Optimized:
      normal components
      normal calculations
      new callbacks
  */

  const [optimized, setOptimized] =
    useState(true);

  /* =======================================================
     PERFORMANCE STATE
  ======================================================= */

  const [performance, setPerformance] =
    useState({
      calendarRenders: 0,
      postListRenders: 0,
      eventCalculations: 0,
    });

  const suppressPerformanceTracking =
    useRef(false);

  const pendingPerformance =
    useRef({
      calendarRenders: 0,
      postListRenders: 0,
      eventCalculations: 0,
    });

  const flushScheduled = useRef(false);

  /* =======================================================
     REDUX POSTS
  ======================================================= */

  const posts = useAppSelector(
    (state) => state.posts.posts
  );

  /* =======================================================
     OPEN CREATE FORM
  ======================================================= */

  const openCreateForm = useCallback(
    (
      dateString = null,
      allDay = false
    ) => {

      let selectedDate = dateString;

      if (selectedDate && allDay) {
        selectedDate =
          `${selectedDate}T09:00:00`;
      }

      setEditPostId(null);

      setDefaultDate(selectedDate);

      setIsFormOpen(true);
    },
    []
  );

  /* =======================================================
     OPEN EDIT FORM
  ======================================================= */

  const openEditForm = useCallback(
    (id) => {

      setEditPostId(id);

      setDefaultDate(null);

      setIsFormOpen(true);
    },
    []
  );

  /* =======================================================
     CLOSE FORM
  ======================================================= */

  const closeForm = useCallback(() => {

    setIsFormOpen(false);

    setEditPostId(null);

    setDefaultDate(null);

  }, []);

  /* =======================================================
     CALENDAR RENDER COUNTER
  ======================================================= */

  const handleCalendarRender =
    useCallback(() => {
      if (suppressPerformanceTracking.current) {
        return;
      }

      pendingPerformance.current.calendarRenders += 1;

      if (!flushScheduled.current) {
        flushScheduled.current = true;

        queueMicrotask(() => {
          flushScheduled.current = false;

          const updates =
            pendingPerformance.current;

          if (
            updates.calendarRenders === 0 &&
            updates.postListRenders === 0 &&
            updates.eventCalculations === 0
          ) {
            return;
          }

          pendingPerformance.current = {
            calendarRenders: 0,
            postListRenders: 0,
            eventCalculations: 0,
          };

          suppressPerformanceTracking.current =
            true;

          setPerformance((previous) => ({
            calendarRenders:
              previous.calendarRenders +
              updates.calendarRenders,
            postListRenders:
              previous.postListRenders +
              updates.postListRenders,
            eventCalculations:
              previous.eventCalculations +
              updates.eventCalculations,
          }));
        });
      }

    }, []);

  /* =======================================================
     POST LIST RENDER COUNTER
  ======================================================= */

  const handlePostListRender =
    useCallback(() => {
      if (suppressPerformanceTracking.current) {
        return;
      }

      pendingPerformance.current.postListRenders += 1;

      if (!flushScheduled.current) {
        flushScheduled.current = true;

        queueMicrotask(() => {
          flushScheduled.current = false;

          const updates =
            pendingPerformance.current;

          if (
            updates.calendarRenders === 0 &&
            updates.postListRenders === 0 &&
            updates.eventCalculations === 0
          ) {
            return;
          }

          pendingPerformance.current = {
            calendarRenders: 0,
            postListRenders: 0,
            eventCalculations: 0,
          };

          suppressPerformanceTracking.current =
            true;

          setPerformance((previous) => ({
            calendarRenders:
              previous.calendarRenders +
              updates.calendarRenders,
            postListRenders:
              previous.postListRenders +
              updates.postListRenders,
            eventCalculations:
              previous.eventCalculations +
              updates.eventCalculations,
          }));
        });
      }

    }, []);

  /* =======================================================
     EVENT CALCULATION COUNTER
  ======================================================= */

  const handleEventCalculation =
    useCallback(() => {
      if (suppressPerformanceTracking.current) {
        return;
      }

      pendingPerformance.current.eventCalculations += 1;

      if (!flushScheduled.current) {
        flushScheduled.current = true;

        queueMicrotask(() => {
          flushScheduled.current = false;

          const updates =
            pendingPerformance.current;

          if (
            updates.calendarRenders === 0 &&
            updates.postListRenders === 0 &&
            updates.eventCalculations === 0
          ) {
            return;
          }

          pendingPerformance.current = {
            calendarRenders: 0,
            postListRenders: 0,
            eventCalculations: 0,
          };

          suppressPerformanceTracking.current =
            true;

          setPerformance((previous) => ({
            calendarRenders:
              previous.calendarRenders +
              updates.calendarRenders,
            postListRenders:
              previous.postListRenders +
              updates.postListRenders,
            eventCalculations:
              previous.eventCalculations +
              updates.eventCalculations,
          }));
        });
      }

    }, []);

  /* =======================================================
     RESET PERFORMANCE
  ======================================================= */

  const resetPerformance =
    useCallback(() => {
      suppressPerformanceTracking.current =
        false;
      flushScheduled.current = false;
      pendingPerformance.current = {
        calendarRenders: 0,
        postListRenders: 0,
        eventCalculations: 0,
      };

      setPerformance({
        calendarRenders: 0,
        postListRenders: 0,
        eventCalculations: 0,
      });

    }, []);

  useEffect(() => {
    suppressPerformanceTracking.current =
      false;
  }, [performance]);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="app">

      {/* ===================================================
          HEADER
      =================================================== */}

      <header className="app-header">

        <div>

          <p className="eyebrow">
            CONTENT PLANNER
          </p>

          <h1>
            Social Media Scheduler
          </h1>

          <p className="subtitle">
            Schedule, manage and organize your social
            media posts using an interactive calendar.
          </p>

        </div>

        <button
          className="create-button"
          onClick={() =>
            openCreateForm()
          }
        >
          + Create Post
        </button>

      </header>

      {/* ===================================================
          MAIN CONTENT
      =================================================== */}

      <main className="main-content">

        {/* ================= CALENDAR ================= */}

        <CalendarView
          optimized={optimized}
          onCreatePost={openCreateForm}
          onEditPost={openEditForm}
          onRender={handleCalendarRender}
          onEventCalculation={
            handleEventCalculation
          }
        />

        {/* ================= PERFORMANCE MONITOR ================= */}

        <PerformanceMonitor
          optimized={optimized}
          setOptimized={setOptimized}
          calendarRenders={
            performance.calendarRenders
          }
          postListRenders={
            performance.postListRenders
          }
          eventCalculations={
            performance.eventCalculations
          }
          postCount={posts.length}
          onReset={resetPerformance}
        />

      </main>

      {/* ===================================================
          POST LIST
      =================================================== */}

      <div className="bottom-content">

        <PostList
          optimized={optimized}
          onEditPost={openEditForm}
          onRender={handlePostListRender}
        />

      </div>

      {/* ===================================================
          POST FORM
      =================================================== */}

      <PostForm
        isOpen={isFormOpen}
        onClose={closeForm}
        editPostId={editPostId}
        defaultDate={defaultDate}
      />

    </div>
  );
}

export default App;
