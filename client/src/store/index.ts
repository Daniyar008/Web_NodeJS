import { configureStore } from '@reduxjs/toolkit'

// Slices will be added here

export const store = configureStore({
  reducer: {
    // Add reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
