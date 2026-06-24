import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Friendship from "../Components/Friendship";

describe('render the ul component and the result of fetch', () => {
    test('should render an ul', async () => {
        window.fetch = vi.fn(() => Promise.resolve({json: () => ({friends: []})}))
        render(<Friendship/>)
        expect(await screen.findByRole('list')).toBeInTheDocument()
    })
    test('should display the result of fetch', async () => {
        window.fetch = vi.fn(() => Promise.resolve({json: () => ({friends: [
            {
                status: 'FRIEND',
                friend: [{
                    username: 'me',
                }]
            }
        ]})}))
        render(<Friendship/>)
        expect(await screen.findByText('me')).toBeInTheDocument()
        expect(await screen.findByText('FRIEND')).toBeInTheDocument()
    })
} )