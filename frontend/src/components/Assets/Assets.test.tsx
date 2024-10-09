import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Assets from './Assets';
import useGetToken from '@/hooks/useGetToken';
import { useQuery } from '@tanstack/react-query';

// Mock the hooks
vi.mock('@/hooks/useGetToken');
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(),
}));

describe('Assets Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display loader when loading', () => {
    (useGetToken as ReturnType<typeof vi.fn>).mockReturnValue('mock-token');
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    });

    render(<Assets projectName="test-project" />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should display error message on error', () => {
    (useGetToken as ReturnType<typeof vi.fn>).mockReturnValue('mock-token');
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
    });

    render(<Assets projectName="test-project" />);

    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should display assets when data is available', () => {
    (useGetToken as ReturnType<typeof vi.fn>).mockReturnValue('mock-token');
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: ['asset1.jpg', 'asset2.jpg'] },
    });

    render(<Assets projectName="test-project" />);

    expect(screen.getByAltText('test-project asset 0')).toBeInTheDocument();
    expect(screen.getByAltText('test-project asset 1')).toBeInTheDocument();
  });
});