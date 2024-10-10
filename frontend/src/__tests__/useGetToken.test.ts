import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/clerk-react';

import { describe, expect, it, vi } from 'vitest';
import useGetToken from '@/hooks/useGetToken';

// Mock the useAuth hook from @clerk/clerk-react
vi.mock('@clerk/clerk-react');

describe('useGetToken', () => {
  it('should return null if user is not signed in', () => {
    // Mock the useAuth hook to return an object where isSignedIn is false
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: false,
      getToken: vi.fn(),
    });

    const { result } = renderHook(() => useGetToken());

    expect(result.current).toBeNull();
  });

  it('should return token if user is signed in', async () => {
    const mockToken = 'mock-token';
    // Mock the useAuth hook to return an object where isSignedIn is true and getToken resolves to a mock token
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isSignedIn: true,
      getToken: vi.fn().mockResolvedValue(mockToken),
    });

    const { result } = renderHook(() => useGetToken());

    // Wait for the useEffect to complete
    await waitFor(() => expect(result.current).toBe(mockToken));

    expect(result.current).toBe(mockToken);
  });
});
