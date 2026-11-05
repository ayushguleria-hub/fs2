import {
  memo,
  useCallback,
} from "react";

import "./PerformanceMonitor.css";

function PerformanceMonitor({
  optimized,
  setOptimized,
  calendarRenders,
  postListRenders,
  eventCalculations,
  postCount,
  onReset,
}) {
  /* =====================================================
     TOGGLE HANDLERS
  ===================================================== */

  const handleOptimized = useCallback(() => {
    setOptimized(true);
  }, [setOptimized]);

  const handleNonOptimized = useCallback(() => {
    setOptimized(false);
  }, [setOptimized]);

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <section className="performance-monitor">

      {/* ================= HEADER ================= */}

      <div className="performance-header">

        <div>
          <span className="performance-label">
            PERFORMANCE MONITOR
          </span>

          <h2>
            React Rendering Optimization
          </h2>
        </div>

        <button
          className="reset-monitor"
          onClick={onReset}
        >
          Reset
        </button>

      </div>

      {/* ================= OPTIMIZATION TOGGLE ================= */}

      <div className="optimization-toggle">

        <button
          className={
            optimized ? "active" : ""
          }
          onClick={handleOptimized}
        >
          Optimized
        </button>

        <button
          className={
            !optimized ? "active" : ""
          }
          onClick={handleNonOptimized}
        >
          Non-Optimized
        </button>

      </div>

      {/* ================= OPTIMIZATION STATUS ================= */}

      <div className="optimization-status">

        <div className="status-item">
          <span>React.memo</span>

          <strong
            className={
              optimized
                ? "enabled"
                : "disabled"
            }
          >
            {optimized
              ? "✓ Active"
              : "✕ Disabled"}
          </strong>
        </div>

        <div className="status-item">
          <span>useMemo</span>

          <strong
            className={
              optimized
                ? "enabled"
                : "disabled"
            }
          >
            {optimized
              ? "✓ Active"
              : "✕ Disabled"}
          </strong>
        </div>

        <div className="status-item">
          <span>useCallback</span>

          <strong
            className={
              optimized
                ? "enabled"
                : "disabled"
            }
          >
            {optimized
              ? "✓ Active"
              : "✕ Disabled"}
          </strong>
        </div>

      </div>

      {/* ================= PERFORMANCE STATS ================= */}

      <div className="performance-stats">

        <div className="stat-card">

          <span>
            Calendar Renders
          </span>

          <strong>
            {calendarRenders}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            PostList Renders
          </span>

          <strong>
            {postListRenders}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            Event Calculations
          </span>

          <strong>
            {eventCalculations}
          </strong>

        </div>

        <div className="stat-card">

          <span>
            Scheduled Posts
          </span>

          <strong>
            {postCount}
          </strong>

        </div>

      </div>

      {/* ================= STATUS INDICATOR ================= */}

      <div
        className={`optimization-indicator ${
          optimized
            ? "optimized"
            : "non-optimized"
        }`}
      >

        <span className="indicator-dot" />

        {optimized
          ? "Optimized rendering is enabled"
          : "Non-optimized rendering is enabled"}

      </div>

    </section>
  );
}

/*
  React.memo means:

  If PerformanceMonitor receives the same props,
  React can skip rendering it.

  It WILL render when performance counters change,
  because those are intentionally passed as props.
*/

export default memo(PerformanceMonitor);