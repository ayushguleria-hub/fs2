import {
  memo,
  useCallback,
  useEffect,
  useMemo,
} from "react";

import {
  useAppDispatch,
  useAppSelector,
} from "../../hooks/reduxHooks";

import {
  deletePost,
} from "../../features/posts/postsSlice";

import "./PostList.css";

/* =========================================================
   POST ITEM
========================================================= */

const PlainPostItem = function PostItem({
  post,
  onEditPost,
  onDeletePost,
}) {
  return (
    <div className="post-item">

      <div className="post-item-content">

        <h3>{post.title}</h3>

        <p>
          {post.platform} • {post.date} • {post.time}
        </p>

        {post.content && (
          <p>{post.content}</p>
        )}

      </div>

      <div className="post-item-actions">

        <button
          onClick={() => onEditPost(post.id)}
        >
          Edit
        </button>

        <button
          onClick={() => onDeletePost(post.id)}
        >
          Delete
        </button>

      </div>

    </div>
  );
};

/*
  In optimized mode, React.memo allows PostItem
  to skip rendering when its props haven't changed.
*/

const MemoizedPostItem = memo(PlainPostItem);

/* =========================================================
   POST LIST
========================================================= */

function PostListInner({
  optimized = true,
  onEditPost,
  onRender,
}) {
  const dispatch = useAppDispatch();

  const posts = useAppSelector(
    (state) => state.posts.posts
  );

  /* =======================================================
     RENDER MONITORING
  ======================================================= */

  /*
    We do NOT call onRender directly while rendering.

    Updating the performance state during render
    could cause additional renders or loops.

    The effect runs after the component has rendered.
  */

  useEffect(() => {
    onRender?.();
  });

  /* =======================================================
     SORT POSTS
  ======================================================= */

  /*
    OPTIMIZED VERSION

    Sorting is only performed again when `posts`
    actually changes.
  */

  const memoizedSortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const dateA = new Date(
        `${a.date || ""}T${a.time || "00:00"}`
      );

      const dateB = new Date(
        `${b.date || ""}T${b.time || "00:00"}`
      );

      return dateA - dateB;
    });
  }, [posts]);

  /*
    NON-OPTIMIZED VERSION

    If optimized === false, sorting happens
    every time PostList renders.
  */

  const sortedPosts = optimized
    ? memoizedSortedPosts
    : [...posts].sort((a, b) => {
        const dateA = new Date(
          `${a.date || ""}T${a.time || "00:00"}`
        );

        const dateB = new Date(
          `${b.date || ""}T${b.time || "00:00"}`
        );

        return dateA - dateB;
      });

  /* =======================================================
     UPCOMING POSTS
  ======================================================= */

  /*
    OPTIMIZED VERSION

    The filtering result is remembered.

    It only recalculates when sortedPosts changes.
  */

  const memoizedUpcomingPosts = useMemo(() => {
    const now = new Date();

    return sortedPosts.filter((post) => {
      if (!post.date) {
        return false;
      }

      const postDate = new Date(
        `${post.date}T${post.time || "00:00"}`
      );

      return postDate >= now;
    });
  }, [sortedPosts]);

  /*
    NON-OPTIMIZED VERSION

    Filtering happens again on every render.
  */

  const upcomingPosts = optimized
    ? memoizedUpcomingPosts
    : sortedPosts.filter((post) => {
        if (!post.date) {
          return false;
        }

        const now = new Date();

        const postDate = new Date(
          `${post.date}T${post.time || "00:00"}`
        );

        return postDate >= now;
      });

  /* =======================================================
     DELETE CALLBACK
  ======================================================= */

  /*
    OPTIMIZED VERSION

    useCallback keeps the same function reference
    between renders.
  */

  const memoizedHandleDeletePost = useCallback(
    (id) => {
      dispatch(deletePost(id));
    },
    [dispatch]
  );

  /*
    NON-OPTIMIZED VERSION

    A new function is created every render.
  */

  const handleDeletePost = optimized
    ? memoizedHandleDeletePost
    : (id) => {
        dispatch(deletePost(id));
      };

  /* =======================================================
     CHOOSE POST ITEM COMPONENT
  ======================================================= */

  /*
    Optimized:
        React.memo PostItem

    Non-Optimized:
        Normal PostItem
  */

  const PostItemComponent = optimized
    ? MemoizedPostItem
    : PlainPostItem;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <section className="post-list-section">

      {/* ================= HEADER ================= */}

      <div className="post-list-header">

        <div>

          <h2>
            Scheduled Posts
          </h2>

          <p>
            {upcomingPosts.length} upcoming post
            {upcomingPosts.length !== 1 ? "s" : ""}
          </p>

        </div>

        <span className="post-count">
          {posts.length} total
        </span>

      </div>

      {/* ================= EMPTY STATE ================= */}

      {sortedPosts.length === 0 ? (

        <div className="empty-post-list">

          <h3>
            No scheduled posts
          </h3>

          <p>
            Create a post to start planning your
            content.
          </p>

        </div>

      ) : (

        /* ================= POST LIST ================= */

        <div className="posts-container">

          {sortedPosts.map((post) => (

            <PostItemComponent
              key={post.id}
              post={post}
              onEditPost={onEditPost}
              onDeletePost={handleDeletePost}
            />

          ))}

        </div>

      )}

    </section>
  );
}

/*
  React.memo protects the complete PostList.

  If App renders because some unrelated state changes,
  PostList can skip rendering when its props and
  selected Redux state haven't changed.
*/

const MemoizedPostList = memo(PostListInner);

function PostList(props) {
  if (props.optimized === false) {
    return <PostListInner {...props} />;
  }

  return <MemoizedPostList {...props} />;
}

export default PostList;
