import { createAsyncThunk, createSelector, createSlice, nanoid } from '@reduxjs/toolkit'

const seedPosts = [
  { id: 'p1', title: 'Product launch', content: 'A quick look at our new analytics dashboard.', platformId: 'linkedin', status: 'scheduled' },
  { id: 'p2', title: 'Behind the scenes', content: 'How the team shaped a faster creator workflow.', platformId: 'instagram', status: 'draft' },
]

// Simulates an API request. Replace this with fetch('/api/posts') in production.
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 650))
  return seedPosts
})

const postsSlice = createSlice({
  name: 'posts',
  initialState: { byId: {}, allIds: [], status: 'idle', error: null },
  reducers: {
    addPost: {
      reducer(state, action) {
        const post = action.payload
        state.byId[post.id] = post
        state.allIds.unshift(post.id)
      },
      prepare(post) { return { payload: { ...post, id: nanoid(), status: post.status || 'draft' } } },
    },
    updatePost(state, action) {
      const { id, changes } = action.payload
      if (state.byId[id]) Object.assign(state.byId[id], changes)
    },
    deletePost(state, action) {
      delete state.byId[action.payload]
      state.allIds = state.allIds.filter((id) => id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => { state.status = 'loading' })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        action.payload.forEach((post) => { state.byId[post.id] = post })
        state.allIds = action.payload.map((post) => post.id)
      })
      .addCase(fetchPosts.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message })
  },
})

export const { addPost, updatePost, deletePost } = postsSlice.actions
export const selectPosts = createSelector(
  [(state) => state.posts.allIds, (state) => state.posts.byId],
  (allIds, byId) => allIds.map((id) => byId[id]),
)
export default postsSlice.reducer
