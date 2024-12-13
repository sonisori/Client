import ky from "ky";

export const client = ky.create({
  prefixUrl: import.meta.env.VITE_SONISORI_BFF_API_URL,
  throwHttpErrors: true,
  credentials: "include",
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          await ky
            .create({
              prefixUrl: import.meta.env.VITE_SONISORI_BFF_API_URL,
              credentials: "include",
            })
            .get("api/reissue");
          return ky(request, options);
        }
      },
    ],
  },
});
