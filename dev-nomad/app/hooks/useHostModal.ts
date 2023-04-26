import { create } from "zustand";

interface HostModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useHostModal = create<HostModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useHostModal;
