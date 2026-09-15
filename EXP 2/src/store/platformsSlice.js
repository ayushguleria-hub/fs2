import { createSelector, createSlice } from '@reduxjs/toolkit'

const initialState = {
  byId: {
    instagram: { id: 'instagram', name: 'Instagram', color: '#d946ef' },
    linkedin: { id: 'linkedin', name: 'LinkedIn', color: '#38bdf8' },
    x: { id: 'x', name: 'X / Twitter', color: '#94a3b8' },
  },
  allIds: ['instagram', 'linkedin', 'x'],
}

const platformsSlice = createSlice({
  name: 'platforms', initialState,
  reducers: {
    addPlatform(state, action) {
      const platform = action.payload
      if (!state.byId[platform.id]) state.allIds.push(platform.id)
      state.byId[platform.id] = platform
    },
    removePlatform(state, action) {
      delete state.byId[action.payload]
      state.allIds = state.allIds.filter((id) => id !== action.payload)
    },
  },
})

export const { addPlatform, removePlatform } = platformsSlice.actions
export const selectPlatforms = createSelector(
  [(state) => state.platforms.allIds, (state) => state.platforms.byId],
  (allIds, byId) => allIds.map((id) => byId[id]),
)
export default platformsSlice.reducer
