import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchInstitutions = createAsyncThunk('institutions/fetchAll', async (_: any, { rejectWithValue }: any) => {
  try {
    const response = await api.get('/institutions');
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch institutions');
  }
});

const institutionSlice = createSlice({
  name: 'institutions',
  initialState: {
    list: [],
    current: null,
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    setCurrentInstitution: (state: any, action: any) => {
      state.current = action.payload;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(fetchInstitutions.pending, (state: any) => { state.isLoading = true; state.error = null; })
      .addCase(fetchInstitutions.fulfilled, (state: any, action: any) => { state.isLoading = false; state.list = action.payload; })
      .addCase(fetchInstitutions.rejected, (state: any, action: any) => { state.isLoading = false; state.error = action.payload as string; });
  },
});

export const { setCurrentInstitution } = institutionSlice.actions;
export default institutionSlice.reducer;
