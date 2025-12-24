import { describe, it, expect, beforeEach, vi } from 'vitest'
import type { AxiosResponse } from 'axios'
import apiService from '../apiService'
import {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  togglePublish,
  getPublicNews,
  getNewsPublicById,
  type NewsItem,
  type PublicNewsItem,
  type ApiSuccess,
} from '../newsService'

// Mock apiService
vi.mock('../apiService', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    defaults: {
      baseURL: 'https://api.example.com',
    },
  },
}))

describe('News Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getAllNews', () => {
    it('should fetch all news items', async () => {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Test News 1',
          content: 'Content 1',
          excerpt: 'Excerpt 1',
          category: 'general',
          date: '2024-01-01',
          imageUrl: '/images/news1.jpg',
          isPublished: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
        {
          id: '2',
          title: 'Test News 2',
          content: 'Content 2',
          category: 'activity',
          date: '2024-01-02',
          isPublished: true,
          createdAt: '2024-01-02T00:00:00Z',
          updatedAt: '2024-01-02T00:00:00Z',
        },
      ]

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          status: 'success',
          data: mockNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem[]>>)

      const result = await getAllNews()

      expect(result).toHaveLength(2)
      expect(result[0].title).toBe('Test News 1')
      expect(result[1].title).toBe('Test News 2')
      expect(apiService.get).toHaveBeenCalledWith('/news')
    })

    it('should handle empty news list', async () => {
      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          status: 'success',
          data: [],
        },
      } as unknown as AxiosResponse<ApiSuccess<NewsItem[]>>)

      const result = await getAllNews()

      expect(result).toEqual([])
    })

    it('should map asset URLs correctly', async () => {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'Test News',
          content: 'Content',
          date: '2024-01-01',
          imageUrl: '/images/news1.jpg',
          isPublished: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          status: 'success',
          data: mockNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem[]>>)

      const result = await getAllNews()

      expect(result[0].imageUrl).toContain('/images/news1.jpg')
    })
  })

  describe('getNewsById', () => {
    it('should fetch a single news item by ID', async () => {
      const mockNews: NewsItem = {
        id: '1',
        title: 'Test News',
        content: 'Content',
        excerpt: 'Excerpt',
        category: 'general',
        date: '2024-01-01',
        imageUrl: '/images/news1.jpg',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          status: 'success',
          data: mockNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem>>)

      const result = await getNewsById('1')

      expect(result.id).toBe('1')
      expect(result.title).toBe('Test News')
      expect(apiService.get).toHaveBeenCalledWith('/news/1')
    })
  })

  describe('createNews', () => {
    it('should create news with image file', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockCreatedNews: NewsItem = {
        id: '1',
        title: 'New News',
        content: 'Content',
        excerpt: 'Excerpt',
        category: 'general',
        date: '2024-01-01',
        imageUrl: '/images/new.jpg',
        isPublished: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(apiService.post).mockResolvedValue({
        data: {
          status: 'success',
          data: mockCreatedNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem>>)

      const payload = {
        title: 'New News',
        content: 'Content',
        excerpt: 'Excerpt',
        category: 'general',
        date: '2024-01-01',
        image: mockFile,
        pdf: null,
      }

      const result = await createNews(payload)

      expect(result.title).toBe('New News')
      expect(apiService.post).toHaveBeenCalled()
      const callArgs = vi.mocked(apiService.post).mock.calls[0]
      expect(callArgs[0]).toBe('/news')
      expect(callArgs[1]).toBeInstanceOf(FormData)
    })

    it('should create news with PDF file', async () => {
      const mockFile = new File(['test'], 'test.pdf', { type: 'application/pdf' })
      const mockCreatedNews: NewsItem = {
        id: '1',
        title: 'New News',
        content: 'Content',
        date: '2024-01-01',
        pdfUrl: '/pdfs/new.pdf',
        isPublished: false,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(apiService.post).mockResolvedValue({
        data: {
          status: 'success',
          data: mockCreatedNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem>>)

      const payload = {
        title: 'New News',
        content: 'Content',
        excerpt: '',
        category: 'general',
        date: '2024-01-01',
        image: null,
        pdf: mockFile,
      }

      const result = await createNews(payload)

      expect(result.title).toBe('New News')
    })
  })

  describe('updateNews', () => {
    it('should update news with FormData when file is provided', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
      const mockUpdatedNews: NewsItem = {
        id: '1',
        title: 'Updated News',
        content: 'Updated Content',
        date: '2024-01-01',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      }

      vi.mocked(apiService.put).mockResolvedValue({
        data: {
          status: 'success',
          data: mockUpdatedNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem>>)

      const payload = {
        title: 'Updated News',
        image: mockFile,
      }

      const result = await updateNews('1', payload)

      expect(result.title).toBe('Updated News')
      expect(apiService.put).toHaveBeenCalled()
      const callArgs = vi.mocked(apiService.put).mock.calls[0]
      expect(callArgs[0]).toBe('/news/1')
      expect(callArgs[1]).toBeInstanceOf(FormData)
    })

    it('should update news with JSON when no file is provided', async () => {
      const mockUpdatedNews: NewsItem = {
        id: '1',
        title: 'Updated News',
        content: 'Updated Content',
        date: '2024-01-01',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
      }

      vi.mocked(apiService.put).mockResolvedValue({
        data: {
          status: 'success',
          data: mockUpdatedNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem>>)

      const payload = {
        title: 'Updated News',
        content: 'Updated Content',
      }

      const result = await updateNews('1', payload)

      expect(result.title).toBe('Updated News')
      expect(apiService.put).toHaveBeenCalledWith('/news/1', payload)
    })
  })

  describe('togglePublish', () => {
    it('should toggle publish status', async () => {
      const mockNews: NewsItem = {
        id: '1',
        title: 'Test News',
        content: 'Content',
        date: '2024-01-01',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(apiService.patch).mockResolvedValue({
        data: {
          status: 'success',
          data: mockNews,
        },
      } as AxiosResponse<ApiSuccess<NewsItem>>)

      const result = await togglePublish('1', true)

      expect(result.isPublished).toBe(true)
      expect(apiService.patch).toHaveBeenCalledWith('/news/1/toggle-publish', {
        isPublished: true,
      })
    })
  })

  describe('deleteNews', () => {
    it('should delete news item', async () => {
      vi.mocked(apiService.delete).mockResolvedValue({} as AxiosResponse)

      await deleteNews('1')

      expect(apiService.delete).toHaveBeenCalledWith('/news/1')
    })
  })

  describe('getPublicNews', () => {
    it('should fetch public news items', async () => {
      const mockPublicNews: PublicNewsItem[] = [
        {
          id: '1',
          slug: 'test-news-1',
          title: 'Public News 1',
          content: 'Content 1',
          date: '2024-01-01',
          category: 'general',
          isPublished: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z',
        },
      ]

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          status: 'success',
          data: mockPublicNews,
        },
      } as AxiosResponse<ApiSuccess<PublicNewsItem[]>>)

      const result = await getPublicNews()

      expect(result).toHaveLength(1)
      expect(result[0].title).toBe('Public News 1')
      expect(apiService.get).toHaveBeenCalledWith(
        '/news/public',
        expect.objectContaining({ params: expect.any(Object) }),
      )
    })
  })

  describe('getNewsPublicById', () => {
    it('should fetch public news by ID', async () => {
      const mockPublicNews: PublicNewsItem = {
        id: '1',
        slug: 'test-news-1',
        title: 'Public News',
        content: 'Content',
        date: '2024-01-01',
        category: 'general',
        isPublished: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
      }

      vi.mocked(apiService.get).mockResolvedValue({
        data: {
          status: 'success',
          data: mockPublicNews,
        },
      } as AxiosResponse<ApiSuccess<PublicNewsItem>>)

      const result = await getNewsPublicById('1')

      expect(result?.id).toBe('1')
      expect(result?.title).toBe('Public News')
      expect(apiService.get).toHaveBeenCalledWith('/news/public/detail', { params: { id: '1' } })
    })

    it('should throw error when ID is empty', async () => {
      await expect(getNewsPublicById('')).rejects.toThrow('News ID is required.')
    })
  })
})
