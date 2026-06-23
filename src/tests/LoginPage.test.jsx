import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, test, vi } from "vitest";
import routes from '../../routes'
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";


const navigate = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
    const mod = await importOriginal()
    return {
        ...mod,
        useNavigate: () => navigate
    }
})

const router = createMemoryRouter(routes, {
    initialEntries: ['/login?issignup=true']
})

describe('test the presence of Components and user signup info', () => {
    test('test the presence of input username component component and his label', () => {
        render(<RouterProvider router={router}/>)
        expect(screen.getByRole('textbox', {name: 'Enter your username'})).toBeInTheDocument()
        expect(screen.getByLabelText('Enter your username')).toBeInTheDocument()
    })
    test('test the presence of input password component and his label', () => {
        render(<RouterProvider router={router}/>)
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
        expect(screen.getByLabelText('Enter your password')).toBeInTheDocument()
    })
    test('test the presence of button element', () => {
        render(<RouterProvider router={router}/>)
        expect(screen.getByRole('button', {name: 'Submit'})).toBeInTheDocument()
    })
    test('test the presence of user connect', () => {
        render(<RouterProvider router={router}/>)
        expect(screen.getByText('Well you\'re now registered, please connect you')).toBeInTheDocument()
    })
})

describe('test user send data', () => {
    test('user type a incorrect username', async () => {
        render(<RouterProvider router={router}/>)
        window.fetch = vi.fn(() =>
            Promise.resolve({
                json: () => ({ msg: ["incorrect username"] }),
            }),
        );
        const user = userEvent.setup();
        const inputUser = screen.getByRole("textbox", {
            name: "Enter your username",
        });
        const inputPassword = screen.getByPlaceholderText(
            "Enter your password",
        );
        const button = screen.getByRole("button");
        await user.type(inputUser, 'qqq')
        await user.type(inputPassword, 'qqq')
        await user.click(button)
        expect(screen.getByText('incorrect username')).toBeInTheDocument()
    })
    test('user type the right input', async () => {
        render(<RouterProvider router={router}/>)
        window.fetch = vi.fn(() => Promise.resolve({json: () => ({user: {}, token: '123'})}))
        const storage = vi.spyOn(Storage.prototype, 'setItem')
        const user = userEvent.setup()
        const inputUsername = screen.getByRole('textbox', {name: 'Enter your username'})
        const inputPassword = screen.getByText('Enter your password')
        const button = screen.getByRole('button')
        await user.type(inputUsername, '111')
        await user.type(inputPassword, '111')
        await user.click(button)
        expect(navigate).toHaveBeenCalledOnce()
        expect(storage).toHaveBeenNthCalledWith(1, 'token', '123')
    })
})