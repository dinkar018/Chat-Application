import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    messages: [],
  },
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addMessage(state, action) {
      const exists = state.messages.some(
        (m) => m._id === action.payload._id
      );
      if (!exists) {
        state.messages.push(action.payload);
      }
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
});

export const { setMessages, addMessage, clearMessages } =
  messageSlice.actions;

export default messageSlice.reducer;
