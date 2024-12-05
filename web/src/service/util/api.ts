import ky from "ky";

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_SONISORI_API_URL,
  throwHttpErrors: true,
});
