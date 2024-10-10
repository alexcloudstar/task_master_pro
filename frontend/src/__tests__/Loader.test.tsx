import { Loader } from '@/components/Loader';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';

describe('Loader Component', () => {
  it('should display loader', () => {
    render(<Loader />);

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('should have correct classes', () => {
    render(<Loader />);

    expect(screen.getByTestId('loader')).toHaveClass('relative w-24 h-24');
  });

  it('should render multiple childrens', () => {
    render(<Loader />);

    expect(screen.getByTestId('loader').children).toHaveLength(3);
  });

  it('(childrens) should have correct classes', () => {
    const { container } = render(<Loader />);
    const firstChild = container.firstChild?.firstChild;
    const secondChild = container.firstChild?.firstChild?.nextSibling;
    const thirdChild =
      container.firstChild?.firstChild?.nextSibling?.nextSibling;

    expect(firstChild).toHaveClass(
      'absolute w-1/12 h-1/12 bg-sky-600 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-play',
    );
    expect(secondChild).toHaveClass(
      'absolute w-1/12 h-3/12 bg-sky-600 top-1/2 animate-moveOne',
    );
    expect(thirdChild).toHaveClass(
      'absolute w-1/12 h-3/12 bg-sky-600 top-1/2 right-0 animate-moveTwo',
    );
  });
});
