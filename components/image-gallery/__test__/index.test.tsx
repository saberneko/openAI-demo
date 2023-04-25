import { render, screen } from '@testing-library/react';

import ImageGallery from '../index';

describe('ImageGallery', () => {
  it('renders a ImageGallery', () => {
    const { container } = render(<ImageGallery />);

    const img = screen.getByRole('img');
    const loading = container.querySelector('.arco-spin');

    expect(img).toBeInTheDocument();
    expect(loading).not.toHaveClass('arco-spin-loading');
  });
})