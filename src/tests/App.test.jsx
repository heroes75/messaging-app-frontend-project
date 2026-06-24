import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import routes from '../../routes'

vi.mock(import('react-router'), async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    useNavigate:  vi.fn(() => {})
  }
})

const router = createMemoryRouter(routes)


describe('App', () => {
  it('renders lists links', () => {
    render(<RouterProvider router={router} />);
    expect(screen.getByRole("link", {name: 'Conversations'})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: 'Friends'})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: 'Profile'})).toBeInTheDocument()
    expect(screen.getByRole("link", {name: 'Notifications'})).toBeInTheDocument()
    // check if App components renders headline
  });
});