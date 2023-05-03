import { create } from "zustand";

interface ShareModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useShareModal = create<ShareModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useShareModal;
