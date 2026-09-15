import { createSlice } from '@reduxjs/toolkit'

const draftsSlice = createSlice({
  name: 'drafts',
  initialState: { activeDraft: { title: '', content: '', platformId: 'instagram' } },
  reducers: {
    updateDraft(state, action) { Object.assign(state.activeDraft, action.payload) },
    clearDraft(state) { state.activeDraft = { title: '', content: '', platformId: 'instagram' } },
  },
})

export const { updateDraft, clearDraft } = draftsSlice.actions
export default draftsSlice.reducer
