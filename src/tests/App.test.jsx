import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createMemoryRouter, RouterProvider } from 'react-router';
import routes from '../../routes'

vi.mock(import('react-router'), async (importOriginal) => {
  const mod = await importOriginal()
  return {
    ...mod,
    useNavigate:  vi.fn(() => () => {})
  }
})

const router = createMemoryRouter(routes)


describe('App', () => {
  it('renders lists links', async () => {
    window.fetch =  vi.fn(() => Promise.resolve({json: () => ({user: {profile: {id: 123}}})}))
    render(<RouterProvider router={router} />);
    expect(await screen.findByRole("link", {name: 'Conversations'})).toBeInTheDocument()
    expect(await screen.findByRole("link", {name: 'Friends'})).toBeInTheDocument()
    expect(await screen.findByRole("link", {name: 'Profile'})).toBeInTheDocument()
    expect(await screen.findByRole("link", {name: 'Notifications'})).toBeInTheDocument()
    // check if App components renders headline
  });
});