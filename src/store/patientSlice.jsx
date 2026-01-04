import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPatients } from "../Services/api";

export const fetchAllpatient = createAsyncThunk(
  "patient/fetchAllpatient",
  async (url, thunkAPI) => {
     try {
      const data = await getPatients(url); 
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
const patientSlice = createSlice({
  name: "patients",
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllpatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllpatient.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllpatient.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  }
});
export default patientSlice.reducer;
