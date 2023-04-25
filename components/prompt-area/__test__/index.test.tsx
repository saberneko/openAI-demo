import { render, screen } from '@testing-library/react';

import PromptArea from '../index';

describe('PromptArea', () => {
  it('renders a promptArea', () => {
    render(<PromptArea />);

    const button = screen.getByRole('button');
    const textarea = screen.getByRole('textbox');

    expect(button).toBeDisabled();
    expect(textarea).toBeInTheDocument();
  })
});