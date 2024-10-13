import { create } from "zustand"

interface useAddApiModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useAddApiModal = create<useAddApiModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
