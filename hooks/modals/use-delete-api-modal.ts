import { create } from "zustand"

interface useDeleteApiModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useDeleteApiModal = create<useDeleteApiModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}))
