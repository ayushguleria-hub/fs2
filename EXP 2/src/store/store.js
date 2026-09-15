import { configureStore } from '@reduxjs/toolkit'
import postsReducer from './postsSlice'
import platformsReducer from './platformsSlice'
import draftsReducer from './draftsSlice'

export const store = configureStore({
  reducer: { posts: postsReducer, platforms: platformsReducer, drafts: draftsReducer },
})
