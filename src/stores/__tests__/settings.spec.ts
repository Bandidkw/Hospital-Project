import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../settings'
import * as settingsService from '@/services/settingsService'
import type { SettingsData } from '@/types/settings'

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
      const mockSettings: SettingsData = {
        id: '1',
        hospitalNameTh: 'โรงพยาบาลทดสอบ',
        hospitalNameEn: 'Test Hospital',
        address: '123 Test St',
        zipCode: '12345',
        province: 'Test Province',
        telMain: '123-456-7890',
        fax: '123-456-7891',
        emailMain: 'test@example.com',
        facebookUrl: 'https://facebook.com/test',
        lineId: '@test',
        youtubeUrl: 'https://youtube.com/test',
        twitterUrl: 'https://twitter.com/test',
        googleMapIframe: '<iframe></iframe>',
        metaDescription: 'Test description',
        keywords: 'test, hospital',
      }

      vi.mocked(settingsService.fetchSettings).mockResolvedValue(mockSettings)

      await store.loadSettings()

      expect(store.settings).toEqual(mockSettings)
      expect(store.loading).toBe(false)
      expect(settingsService.fetchSettings).toHaveBeenCalled()
    })

    it('should not reload settings if already loaded', async () => {
      const store = useSettingsStore()
      const mockSettings: SettingsData = {
        id: '1',
        hospitalNameTh: 'โรงพยาบาลทดสอบ',
        hospitalNameEn: 'Test Hospital',
        address: '123 Test St',
        zipCode: '12345',
        province: 'Test Province',
        telMain: '123-456-7890',
        fax: '123-456-7891',
        emailMain: 'test@example.com',
        facebookUrl: 'https://facebook.com/test',
        lineId: '@test',
        youtubeUrl: 'https://youtube.com/test',
        twitterUrl: 'https://twitter.com/test',
        googleMapIframe: '<iframe></iframe>',
        metaDescription: 'Test description',
        keywords: 'test, hospital',
      }

      vi.mocked(settingsService.fetchSettings).mockResolvedValue(mockSettings)

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
      let resolvePromise: (value: SettingsData) => void
      const promise = new Promise<SettingsData>((resolve) => {
        resolvePromise = resolve
      })

      vi.mocked(settingsService.fetchSettings).mockReturnValue(promise)

      const loadPromise = store.loadSettings()

      expect(store.loading).toBe(true)

      resolvePromise!({
        id: '1',
        hospitalNameTh: 'โรงพยาบาลทดสอบ',
        hospitalNameEn: 'Test Hospital',
        address: '123 Test St',
        zipCode: '12345',
        province: 'Test Province',
        telMain: '123-456-7890',
        fax: '123-456-7891',
        emailMain: 'test@example.com',
        facebookUrl: 'https://facebook.com/test',
        lineId: '@test',
        youtubeUrl: 'https://youtube.com/test',
        twitterUrl: 'https://twitter.com/test',
        googleMapIframe: '<iframe></iframe>',
        metaDescription: 'Test description',
        keywords: 'test, hospital',
      })
      await loadPromise

      expect(store.loading).toBe(false)
    })
  })
})
