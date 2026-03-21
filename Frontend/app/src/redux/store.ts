import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import institutionReducer from './slices/institutionSlice';
import courseReducer from './slices/courseSlice';
import studentReducer from './slices/studentSlice';
import todoReducer from './slices/todoSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    institutions: institutionReducer,
    courses: courseReducer,
    student: studentReducer,
    todos: todoReducer,
    chats: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
