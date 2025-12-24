# Testing Guide

This project uses [Vitest](https://vitest.dev/) for unit testing and [Vue Test Utils](https://test-utils.vuejs.org/) for component testing.

## Running Tests

### Run all tests
```bash
npm run test:unit
```

### Run tests in watch mode
```bash
npm run test:unit -- --watch
```

### Run tests once
```bash
npm run test:unit -- --run
```

### Run tests with coverage
```bash
npm run test:unit -- --coverage
```

## Test Structure

Tests are organized in `__tests__` directories next to the files they test:

```
src/
├── components/
│   ├── __tests__/
│   │   ├── AppNavbar.spec.ts
│   │   ├── LoginModal.spec.ts
│   │   ├── LoadingSpinner.spec.ts
│   │   ├── BackToTopButton.spec.ts
│   │   └── ...
│   └── ...
├── stores/
│   ├── __tests__/
│   │   ├── auth.spec.ts
│   │   ├── settings.spec.ts
│   │   └── ...
│   └── ...
└── services/
    ├── __tests__/
    │   ├── newsService.spec.ts
    │   ├── personnelService.spec.ts
    │   └── ...
    └── ...
```

## Test Coverage

### Stores (Pinia)
- ✅ **auth.spec.ts** - Authentication store tests
  - Login/logout functionality
  - User profile management
  - Password reset
  - Role-based access control
  - Session storage handling

- ✅ **settings.spec.ts** - Settings store tests
  - Loading settings
  - Error handling
  - Caching behavior

### Services
- ✅ **newsService.spec.ts** - News service tests
  - Fetching news items
  - Creating/updating/deleting news
  - Public news API
  - Asset URL mapping

- ✅ **personnelService.spec.ts** - Personnel service tests
  - Public and admin personnel lists
  - CRUD operations
  - File upload handling
  - Error fallbacks

### Components
- ✅ **AppNavbar.spec.ts** - Navigation bar tests
  - Menu rendering
  - Dropdown functionality
  - Authentication state display
  - Mobile menu toggle

- ✅ **LoginModal.spec.ts** - Login modal tests
  - Form submission
  - Password visibility toggle
  - Authentication flow
  - Error handling
  - Redirect logic

- ✅ **LoadingSpinner.spec.ts** - Loading spinner tests
  - Rendering
  - Styling

- ✅ **BackToTopButton.spec.ts** - Back to top button tests
  - Visibility based on scroll position
  - Scroll to top functionality
  - Event listener management

## Writing New Tests

### Component Test Example

```typescript
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MyComponent from '../MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyComponent, {
      props: { msg: 'Hello' }
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
```

### Store Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMyStore } from '../myStore'

describe('MyStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes correctly', () => {
    const store = useMyStore()
    expect(store.value).toBe(null)
  })
})
```

### Service Test Example

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import apiService from '../apiService'
import { myServiceFunction } from '../myService'

vi.mock('../apiService', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('MyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('fetches data correctly', async () => {
    vi.mocked(apiService.get).mockResolvedValue({
      data: { data: { id: '1' } }
    })

    const result = await myServiceFunction()
    expect(result.id).toBe('1')
  })
})
```

## Test Configuration

Test configuration is in `vitest.config.ts`. Key settings:

- **Environment**: jsdom (for DOM testing)
- **Setup File**: `src/test/setup.ts` (global test setup)
- **Excludes**: e2e tests

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Mocking**: Mock external dependencies (API calls, router, etc.)
3. **Cleanup**: Use `beforeEach`/`afterEach` to reset state
4. **Descriptive Names**: Use clear test descriptions
5. **Coverage**: Aim for high coverage of critical paths
6. **Fast Tests**: Keep tests fast and focused

## Common Patterns

### Mocking API Calls
```typescript
vi.mocked(apiService.get).mockResolvedValue({
  data: { data: mockData }
})
```

### Testing Async Functions
```typescript
it('handles async operations', async () => {
  await store.loadData()
  expect(store.data).toBeDefined()
})
```

### Testing Component Events
```typescript
await wrapper.find('button').trigger('click')
expect(wrapper.emitted('custom-event')).toBeTruthy()
```

### Testing Router Navigation
```typescript
const pushSpy = vi.spyOn(router, 'push')
await component.navigate()
expect(pushSpy).toHaveBeenCalledWith('/expected-path')
```

## Troubleshooting

### Tests failing with "Cannot find module"
- Ensure all dependencies are installed: `npm install`
- Check import paths match your project structure

### Component not rendering
- Make sure to provide required props
- Check if component needs router/pinia plugins

### Mock not working
- Verify mock is set up before the test runs
- Check that you're mocking the correct module path

## Continuous Integration

Tests should run automatically in CI/CD pipelines. Ensure:
- All tests pass before merging
- Coverage thresholds are met
- No console errors in test output

