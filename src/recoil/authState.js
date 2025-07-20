// src/recoil/authState.js
import { atom } from "recoil";

export const authState = atom({
  key: "authState",
  default: {
    isLoggedIn: false,
    user: null, // 사용자 정보 필요하면 여기에
  },
});
