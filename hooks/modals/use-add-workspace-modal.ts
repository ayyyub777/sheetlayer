import { create } from "zustand"

interface useAddWorkspaceModalStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useAddWorkspaceModal = create<useAddWorkspaceModalStore>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
)
