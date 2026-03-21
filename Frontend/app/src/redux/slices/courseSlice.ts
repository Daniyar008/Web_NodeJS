import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCourses = createAsyncThunk('courses/fetchAll', async (_: any, { rejectWithValue }: any) => {
  try {
    const response = await api.get('/courses');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    list: [],
    selectedCourse: null,
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    selectCourse: (state: any, action: any) => {
      state.selectedCourse = action.payload;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchCourses.pending, (state: any) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCourses.fulfilled, (state: any, action: any) => { state.isLoading = false; state.list = action.payload; })
      .addCase(fetchCourses.rejected, (state: any, action: any) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export const { selectCourse } = courseSlice.actions;
export default courseSlice.reducer;
