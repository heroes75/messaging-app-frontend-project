import { screen, render } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { createMemoryRouter, RouterProvider } from "react-router";
import SignupPage from "../Conponents/SignupPage";
import userEvent from "@testing-library/user-event";
import routes from '../../routes'


const navigate = vi.fn()
vi.mock(import('react-router'), async (importOriginal) => {
    const module = await importOriginal()
    return {
        ...module,
        useNavigate: () => navigate
    }
})



const router = createMemoryRouter(routes, {
    initialEntries: ['/signup']
})

describe('should have three inputs components and a button', () => {
    test('a input username with his label', () => {
    // render(<SignupPage/>)
    render(<RouterProvider router={router} />)
        expect(screen.getByRole('textbox', {name: 'Enter your username'})).toBeInTheDocument()
        expect(screen.getByLabelText('Enter your username')).toBeInTheDocument()
    })
    test('a input password and his label', () => {
        render(<SignupPage/>)
        expect(screen.getByPlaceholderText('Enter your password')).toBeInTheDocument()
        expect(screen.getByLabelText('Enter your password')).toBeInTheDocument()
    })
    test('a confirmPassword input and his label', () => {
        render(<SignupPage/>)
        expect(screen.getByPlaceholderText('Confirm your password')).toBeInTheDocument()
        expect(screen.getByLabelText('Confirm your password')).toBeInTheDocument()
    })
    test('a button', () => {
        render(<SignupPage/>)
        expect(screen.getByRole('button', {name: 'Submit'}))
    })
})

describe('should be display the right message error', async () => {
    test('if user type no input should be have these following errors', async () => {
        render(<SignupPage/>)
        const user = userEvent.setup()
        const button = screen.getByRole('button')
        await user.click(button)
        expect(screen.getByText('Your username must be an alphanumeric'))
        expect(screen.getByText('Your username must overflow 3 characters'))
        expect(screen.getByText('Your password must contains at least one number'))
        expect(screen.getByText('Your password must contains at least one Upper-case'))
        expect(screen.getByText('Your password must contains at least one Lower-case'))
        expect(screen.getByText('Your password must overflow 8 characters'))
        expect(screen.getByText('Your password must contains at least one non-alphanumeric character'))

    })
    test('if user type the wrong input it\'s should be display the message error', async () => {
        render(<SignupPage/>)
        const user =  userEvent.setup()
        const inputUsername = screen.getByRole('textbox', {name: 'Enter your username'})
        const inputPassword = screen.getByText('Enter your password')
        const inputConfirmPassword = screen.getByText('Confirm your password')
        const button = screen.getByRole('button')
        await user.type(inputUsername, 'q')
        await user.type(inputPassword, '1a')
        await user.type(inputConfirmPassword, '1')
        await user.click(button)
        expect(screen.getByText('Your username must overflow 3 characters'))
        expect(screen.getByText('Your password must contains at least one Upper-case'))
        expect(screen.getByText('Your password must contains at least one non-alphanumeric character'))
        expect(screen.getByText('Your password must overflow 8 characters'))
        expect(screen.getByText('Your confirm Password must be equal to your password'))
    })
})

describe('if user type the right i\'s should be display redirect', () => {
    test('the user type an existing username', async () => {
        window.fetch = vi.fn(() => Promise.resolve(({json: () => ({msg: ['this username already exist']})})))
        render(<SignupPage/>)
        const user =  userEvent.setup()
        const inputUsername = screen.getByRole('textbox', {name: 'Enter your username'})
        const inputPassword = screen.getByText('Enter your password')
        const inputConfirmPassword = screen.getByText('Confirm your password')
        const button = screen.getByRole('button')
        await user.type(inputUsername, 'qqq')
        await user.type(inputPassword, '1234567@Aa')
        await user.type(inputConfirmPassword, '1234567@Aa')
        await user.click(button)
        expect(screen.getByText('this username already exist')).toBeInTheDocument()
    })
    test('the user type the right input', async () => {
        window.fetch = vi.fn(() => Promise.resolve(({json: () => ({user: ''})})))
        render(<SignupPage/>)
        const user =  userEvent.setup()
        const inputUsername = screen.getByRole('textbox', {name: 'Enter your username'})
        const inputPassword = screen.getByText('Enter your password')
        const inputConfirmPassword = screen.getByText('Confirm your password')
        const button = screen.getByRole('button')
        await user.type(inputUsername, 'qqq')
        await user.type(inputPassword, '1234567@Aa')
        await user.type(inputConfirmPassword, '1234567@Aa')
        await user.click(button)
        expect(navigate).toHaveBeenCalledOnce()
    })
})