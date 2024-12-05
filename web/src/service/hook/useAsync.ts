import { createSignal } from "solid-js";

export const useAsync = () => {
  const [loading, setLoading] = createSignal(false);

  const wrap = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return { wrap, loading };
};
