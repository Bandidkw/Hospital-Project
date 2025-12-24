import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { AxiosResponse } from 'axios'
import apiService from '../apiService'
import {
  getPublicPersonnelList,
  getAdminPersonnelList,
  createPersonnel,
  updatePersonnel,
  deletePersonnel,
} from '../personnelService'
import type { PersonnelItem } from '@/types/personnel'

// Mock apiService
vi.mock('../apiService', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    defaults: {
      baseURL: 'https://api.example.com',
    },
  },
  isAxiosError: vi.fn((error) => error?.isAxiosError === true),
}))

describe('Personnel Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPublicPersonnelList', () => {
    it('should fetch public personnel list successfully', async () => {
      const mockPersonnel = [
        {
          id: '1',
          name: 'John Doe',
          position: 'Doctor',
          specialty: 'Cardiology',
          imageUrl: '/images/john.jpg',
          tel: '123-456-7890',
          isDirector: true,
        },
        {
          id: '2',
          name: 'Jane Smith',
          position: 'Nurse',
          imageUrl: '/images/jane.jpg',
          isDirector: false,
        },
      ]

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          data: mockPersonnel,
        },
      } as AxiosResponse<{ data: PersonnelItem[] }>)

      const result = await getPublicPersonnelList()

      expect(result).toHaveLength(2)
      expect(result[0].name).toBe('John Doe')
      expect(result[0].isDirector).toBe(true)
      expect(result[1].name).toBe('Jane Smith')
      expect(apiService.get).toHaveBeenCalledWith('/personnel')
    })

    it('should return mock data on API failure', async () => {
      vi.mocked(apiService.get).mockRejectedValue(new Error('Network error'))
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await getPublicPersonnelList()

      expect(result.length).toBeGreaterThan(0)
      expect(result[0].id).toBe('d0')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('should map asset URLs correctly', async () => {
      const mockPersonnel = [
        {
          id: '1',
          name: 'John Doe',
          position: 'Doctor',
          imageUrl: '/images/john.jpg',
          isDirector: false,
        },
      ]

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          data: mockPersonnel,
        },
      } as AxiosResponse<{ data: PersonnelItem[] }>)

      const result = await getPublicPersonnelList()

      expect(result[0].imageUrl).toContain('/images/john.jpg')
    })
  })

  describe('getAdminPersonnelList', () => {
    it('should fetch admin personnel list successfully', async () => {
      const mockPersonnel = [
        {
          id: '1',
          name: 'Admin User',
          position: 'Administrator',
          isDirector: false,
        },
      ]

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          data: mockPersonnel,
        },
      } as AxiosResponse<{ data: PersonnelItem[] }>)

      const result = await getAdminPersonnelList()

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Admin User')
      expect(apiService.get).toHaveBeenCalledWith('/personnel/all')
    })

    it('should return mock data on API failure', async () => {
      vi.mocked(apiService.get).mockRejectedValue(new Error('Network error'))
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await getAdminPersonnelList()

      expect(result.length).toBeGreaterThan(0)
      expect(result[0].id).toBe('a1')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('createPersonnel', () => {
    it('should create personnel with all fields', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockCreatedPersonnel: PersonnelItem = {
        id: '1',
        name: 'New Person',
        position: 'New Position',
        specialty: 'New Specialty',
        imageUrl: '/images/new.jpg',
        tel: '123-456-7890',
        isDirector: false,
      }

      vi.mocked(apiService.post).mockResolvedValue({
        data: {
          data: mockCreatedPersonnel,
        },
      } as AxiosResponse<{ data: PersonnelItem }>)

      const data = {
        name: 'New Person',
        position: 'New Position',
        specialty: 'New Specialty',
        tel: '123-456-7890',
        imageFile: mockFile,
        isDirector: false,
      }

      const result = await createPersonnel(data)

      expect(result.name).toBe('New Person')
      expect(apiService.post).toHaveBeenCalled()
      const callArgs = vi.mocked(apiService.post).mock.calls[0]
      expect(callArgs[0]).toBe('/personnel')
      expect(callArgs[1]).toBeInstanceOf(FormData)
    })

    it('should create personnel without optional fields', async () => {
      const mockCreatedPersonnel: PersonnelItem = {
        id: '1',
        name: 'Simple Person',
        position: 'Simple Position',
        isDirector: false,
      }

      vi.mocked(apiService.post).mockResolvedValue({
        data: {
          data: mockCreatedPersonnel,
        },
      } as AxiosResponse<{ data: PersonnelItem }>)

      const data = {
        name: 'Simple Person',
        position: 'Simple Position',
        isDirector: false,
      }

      const result = await createPersonnel(data)

      expect(result.name).toBe('Simple Person')
    })
  })

  describe('updatePersonnel', () => {
    it('should update personnel with new data', async () => {
      const mockFile = new File(['test'], 'updated.jpg', { type: 'image/jpeg' })
      const mockUpdatedPersonnel: PersonnelItem = {
        id: '1',
        name: 'Updated Person',
        position: 'Updated Position',
        isDirector: true,
      }

      vi.mocked(apiService.patch).mockResolvedValue({
        data: {
          data: mockUpdatedPersonnel,
        },
      } as AxiosResponse<{ data: PersonnelItem }>)

      const data = {
        name: 'Updated Person',
        position: 'Updated Position',
        imageFile: mockFile,
        isDirector: true,
      }

      const result = await updatePersonnel('1', data)

      expect(result.name).toBe('Updated Person')
      expect(apiService.patch).toHaveBeenCalledWith('/personnel/1', expect.any(FormData), {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
    })

    it('should update personnel without image file', async () => {
      const mockUpdatedPersonnel: PersonnelItem = {
        id: '1',
        name: 'Updated Person',
        position: 'Updated Position',
        isDirector: false,
      }

      vi.mocked(apiService.patch).mockResolvedValue({
        data: {
          data: mockUpdatedPersonnel,
        },
      } as AxiosResponse<{ data: PersonnelItem }>)

      const data = {
        name: 'Updated Person',
        position: 'Updated Position',
        isDirector: false,
      }

      const result = await updatePersonnel('1', data)

      expect(result.name).toBe('Updated Person')
    })
  })

  describe('deletePersonnel', () => {
    it('should delete personnel by ID', async () => {
      vi.mocked(apiService.delete).mockResolvedValue({} as AxiosResponse)

      await deletePersonnel('1')

      expect(apiService.delete).toHaveBeenCalledWith('/personnel/1')
    })
  })
})
