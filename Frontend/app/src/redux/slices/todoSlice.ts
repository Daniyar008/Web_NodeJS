import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchTodos = createAsyncThunk('todos/fetchAll', async (_: any, { rejectWithValue }: any) => {
  try {
    const response = await api.get('/todos');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch todos');
  }
});

const todoSlice = createSlice({
  name: 'todos',
  initialState: {
    items: [],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchTodos.pending, (state: any) => { state.isLoading = true; state.error = null; })
      .addCase(fetchTodos.fulfilled, (state: any, action: any) => { state.isLoading = false; state.items = action.payload; })
      .addCase(fetchTodos.rejected, (state: any, action: any) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export default todoSlice.reducer;
