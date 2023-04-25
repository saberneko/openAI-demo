import { render, screen } from '@testing-library/react';

import DownloadButton from '../index';

describe('DownloadButton', () => {
  it('render a downloadbutton', () => {
    render(<DownloadButton />);

    const btn = screen.getByText(/Download/i);

    expect(btn).toBeInTheDocument();
  })
})