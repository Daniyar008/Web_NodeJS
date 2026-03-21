import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchChats = createAsyncThunk('chats/fetchAll', async (_: any, { rejectWithValue }: any) => {
  try {
    const response = await api.get('/chats');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch chats');
  }
});

const chatSlice = createSlice({
  name: 'chats',
  initialState: {
    rooms: [],
    activeChat: null,
    messages: [],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    setActiveChat: (state: any, action: any) => {
      state.activeChat = action.payload;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchChats.pending, (state: any) => { state.isLoading = true; state.error = null; })
      .addCase(fetchChats.fulfilled, (state: any, action: any) => { state.isLoading = false; state.rooms = action.payload; })
      .addCase(fetchChats.rejected, (state: any, action: any) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export const { setActiveChat } = chatSlice.actions;
export default chatSlice.reducer;
