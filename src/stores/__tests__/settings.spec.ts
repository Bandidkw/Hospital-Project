import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../settings'
import * as settingsService from '@/services/settingsService'

// Mock settingsService
vi.mock('@/services/settingsService', () => ({
  fetchSettings: vi.fn(),
}))

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('Initial State', () => {
    it('should initialize with null settings and loading false', () => {
      const store = useSettingsStore()
      expect(store.settings).toBeNull()
      expect(store.loading).toBe(false)
    })
  })

  describe('loadSettings', () => {
    it('should load settings successfully', async () => {
      const store = useSettingsStore()
      const mockSettings = {
        id: '1',
        hospitalName: 'Test Hospital',
        address: '123 Test St',
        phone: '123-456-7890',
      }

      vi.mocked(settingsService.fetchSettings).mockResolvedValue(mockSettings as any)

      await store.loadSettings()

      expect(store.settings).toEqual(mockSettings)
      expect(store.loading).toBe(false)
      expect(settingsService.fetchSettings).toHaveBeenCalled()
    })

    it('should not reload settings if already loaded', async () => {
      const store = useSettingsStore()
      const mockSettings = {
        id: '1',
        hospitalName: 'Test Hospital',
      }

      vi.mocked(settingsService.fetchSettings).mockResolvedValue(mockSettings as any)

      // Load first time
      await store.loadSettings()
      expect(settingsService.fetchSettings).toHaveBeenCalledTimes(1)

      // Try to load again
      await store.loadSettings()
      expect(settingsService.fetchSettings).toHaveBeenCalledTimes(1) // Should not call again
    })

    it('should handle errors during loading', async () => {
      const store = useSettingsStore()
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      vi.mocked(settingsService.fetchSettings).mockRejectedValue(new Error('Network error'))

      await store.loadSettings()

      expect(store.settings).toBeNull()
      expect(store.loading).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should set loading to true while fetching', async () => {
      const store = useSettingsStore()
      let resolvePromise: (value: any) => void
      const promise = new Promise((resolve) => {
        resolvePromise = resolve
      })

      vi.mocked(settingsService.fetchSettings).mockReturnValue(promise as any)

      const loadPromise = store.loadSettings()

      expect(store.loading).toBe(true)

      resolvePromise!({ id: '1', hospitalName: 'Test' })
      await loadPromise

      expect(store.loading).toBe(false)
    })
  })
})

