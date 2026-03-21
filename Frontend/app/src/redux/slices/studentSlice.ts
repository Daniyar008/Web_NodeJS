import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchLeaderboard = createAsyncThunk('gamification/fetchLeaderboard', async (_: any, { rejectWithValue }: any) => {
  try {
    const response = await api.get('/gamification/leaderboard');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch leaderboard');
  }
});

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    enrollments: [],
    leaderboard: [],
    achievements: [],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchLeaderboard.pending, (state: any) => { state.isLoading = true; state.error = null; })
      .addCase(fetchLeaderboard.fulfilled, (state: any, action: any) => { state.isLoading = false; state.leaderboard = action.payload; })
      .addCase(fetchLeaderboard.rejected, (state: any, action: any) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export default studentSlice.reducer;
