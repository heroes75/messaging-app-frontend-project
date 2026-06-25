import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Notifications from "../Components/Notification";

describe('render the ul and the listItems', () => {
    test('render the corresponding fetch', async () => {
        const notifications = [
            {
                notification: 'qqq send you a message',
                createdAt: '22-05-32',
            },
            {
                notification: 'qqq2 send you a message',
                createdAt: '22-05-32',
            }
        ]
        window.fetch = vi.fn(() => Promise.resolve({json: () => ({notifications})}))
        render(<Notifications/>)
        const messageOne = await screen.findByText(notifications[0].notification)
        const messageTwo = await screen.findByText(notifications[1].notification)
        expect(messageOne).toBeInTheDocument()
        expect(messageTwo).toBeInTheDocument()
        expect(await screen.findByRole('list')).toBeInTheDocument()
    })
})