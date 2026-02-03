import { create } from 'zustand'

const usePhotoboothStore = create((set) => ({
  // Screen state
  currentScreen: 'welcome',
  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  
  // Session & Photo data
  sessionId: null,
  setSessionId: (id) => set({ sessionId: id }),
  
  photoId: null,
  setPhotoId: (id) => set({ photoId: id }),
  
  originalPhoto: null,
  setOriginalPhoto: (photo) => set({ originalPhoto: photo }),
  
  processedPhoto: null,
  setProcessedPhoto: (photo) => set({ processedPhoto: photo }),
  
  qrCode: null,
  setQRCode: (code) => set({ qrCode: code }),
  
  // Selection state
  selectedBackground: null,
  setSelectedBackground: (bg) => set({ selectedBackground: bg }),
  
  selectedFilter: null,
  setSelectedFilter: (filter) => set({ selectedFilter: filter }),
  
  selectedMascot: null,
  setSelectedMascot: (mascot) => set({ selectedMascot: mascot }),
  
  // UI state
  loading: false,
  setLoading: (loading) => set({ loading }),
  
  progress: 0,
  setProgress: (progress) => set({ progress }),
  
  error: null,
  setError: (error) => set({ error }),
  
  // Utilities
  reset: () => set({
    currentScreen: 'welcome',
    sessionId: null,
    photoId: null,
    originalPhoto: null,
    processedPhoto: null,
    qrCode: null,
    selectedBackground: null,
    selectedFilter: null,
    selectedMascot: null,
    loading: false,
    progress: 0,
    error: null,
  }),
}))

export default usePhotoboothStore
