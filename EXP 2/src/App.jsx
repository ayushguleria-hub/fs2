import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addPost, deletePost, fetchPosts, selectPosts, updatePost } from './store/postsSlice'
import { clearDraft, updateDraft } from './store/draftsSlice'
import { selectPlatforms } from './store/platformsSlice'

export default function App() {
  const dispatch = useDispatch()
  const posts = useSelector(selectPosts)
  const platforms = useSelector(selectPlatforms)
  const draft = useSelector((state) => state.drafts.activeDraft)
  const loadStatus = useSelector((state) => state.posts.status)

  useEffect(() => { if (loadStatus === 'idle') dispatch(fetchPosts()) }, [dispatch, loadStatus])
  const platform = (id) => platforms.find((item) => item.id === id)
  const submit = (event) => {
    event.preventDefault()
    if (!draft.title.trim()) return
    dispatch(addPost(draft)); dispatch(clearDraft())
  }

  return <main>
    <section className="hero"><p className="eyebrow">EXPERIMENT 1.2.1</p><h1>PostFlow</h1><p>Centralized social content planning with Redux Toolkit.</p></section>
    <section className="metrics">
      <div><strong>{posts.length}</strong><span>Total posts</span></div>
      <div><strong>{platforms.length}</strong><span>Platforms</span></div>
      <div><strong>{posts.filter((p) => p.status === 'scheduled').length}</strong><span>Scheduled</span></div>
    </section>
    <div className="layout">
      <form className="composer" onSubmit={submit}>
        <p className="eyebrow">GLOBAL DRAFT</p><h2>Create a post</h2>
        <label>Title<input value={draft.title} onChange={(e) => dispatch(updateDraft({ title: e.target.value }))} placeholder="Give your post a name" /></label>
        <label>Message<textarea value={draft.content} onChange={(e) => dispatch(updateDraft({ content: e.target.value }))} placeholder="Write something worth sharing…" /></label>
        <label>Platform<select value={draft.platformId} onChange={(e) => dispatch(updateDraft({ platformId: e.target.value }))}>{platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select></label>
        <button type="submit">Add to posts <span>→</span></button>
      </form>
      <section className="feed"><div className="feed-title"><div><p className="eyebrow">NORMALIZED COLLECTION</p><h2>Content queue</h2></div><button className="reload" onClick={() => dispatch(fetchPosts())}>Reload mock API</button></div>
      {loadStatus === 'loading' && <p className="loading">Loading posts…</p>}
      {posts.map((post) => <article className="post" key={post.id}>
        <i style={{ background: platform(post.platformId)?.color }} />
        <div className="post-copy"><div className="post-meta"><span>{platform(post.platformId)?.name}</span><em className={post.status}>{post.status}</em></div><h3>{post.title}</h3><p>{post.content}</p></div>
        <div className="actions"><button onClick={() => dispatch(updatePost({ id: post.id, changes: { status: post.status === 'draft' ? 'scheduled' : 'draft' } }))}>{post.status === 'draft' ? 'Schedule' : 'Unplan'}</button><button aria-label={'Delete ' + post.title} onClick={() => dispatch(deletePost(post.id))}>×</button></div>
      </article>)}</section>
    </div>
  </main>
}
