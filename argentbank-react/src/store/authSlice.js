import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1/user';

// Appel API commun : retourne { ok, data } ou { ok: false, error } (pas rejectWithValue, pour éviter de le "consommer")
async function apiRequest(url, { method = 'GET', body, token }, defaultError) {
  const headers = {};
  if (body || method !== 'GET') headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const res = await fetch(url, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });
    const data = await res.json().catch(() => ({}));
    if (data.status !== 200) {
      return { ok: false, error: data.message || defaultError };
    }
    return { ok: true, data: data.body };
  } catch (err) {
    return { ok: false, error: err.message || defaultError || 'Network error' };
  }
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    const result = await apiRequest(
      `${API_BASE}/login`,
      { method: 'POST', body: { email, password } },
      'Login failed'
    );
    if (!result.ok) return rejectWithValue(result.error);
    if (!result.data?.token) return rejectWithValue('Invalid response');
    return result.data.token;
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('No token');
    const result = await apiRequest(`${API_BASE}/profile`, { token }, 'Failed to fetch profile');
    if (!result.ok) return rejectWithValue(result.error);
    return result.data;
  }
);

export const updateUsername = createAsyncThunk(
  'auth/updateUsername',
  async (userName, { getState, rejectWithValue }) => {
    const token = getState().auth.token;
    if (!token) return rejectWithValue('No token');
    const result = await apiRequest(
      `${API_BASE}/profile`,
      { method: 'PUT', body: { userName }, token },
      'Failed to update username'
    );
    if (!result.ok) return rejectWithValue(result.error);
    return result.data;
  }
);

const initialState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

// Helper : même schéma pending/fulfilled/rejected pour chaque thunk
const asyncThunkCases = (builder, thunk, onFulfilled) => {
  builder
    .addCase(thunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(thunk.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      onFulfilled(state, action.payload);
    })
    .addCase(thunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Error';
    });
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    asyncThunkCases(builder, login, (state, token) => {
      state.token = token;
    });
    asyncThunkCases(builder, fetchProfile, (state, user) => {
      state.user = user;
    });
    asyncThunkCases(builder, updateUsername, (state, user) => {
      state.user = user;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
