import { create } from "zustand";

// store for loaders
const useLoaderStore = create((set) => ({
  loading: false,
  showLoader: () => set({ loading: true }),
  hideLoader: () => set({ loading: false }),
}));

export default useLoaderStore;