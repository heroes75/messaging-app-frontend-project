import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Conversations from "../Components/Conversations";

describe('should have an ul component and render the result of fetch', () => {
    test('should render an ul components', async () => {
        window.fetch = vi.fn(() => Promise.resolve({json: () => ({conversations: []})}))
        render(<Conversations/>)
        expect(await screen.findByRole('list')).toBeInTheDocument()
    })
    test('render the result of fetch', async () => {
        window.fetch = vi.fn(() => Promise.resolve({json: () => ({conversations: [
            {
                participants: [
                    {
                        user: {
                            username: 'franck'
                        }
                    }
                ]
            }
        ]})}))
        render(<Conversations/>)
        const name = await screen.findByText('franck')
        expect(name).toBeInTheDocument()
    })
})