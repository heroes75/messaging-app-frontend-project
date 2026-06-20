import { screen, render } from "@testing-library/react";
import { describe, test, expect } from "vitest";

import SignupPage from "../Conponents/SignupPage";
import userEvent from "@testing-library/user-event";

describe('should have three inputs components and a button', () => {
    test('a input username with his label', () => {
    render(<SignupPage/>)
        expect(screen.getByRole('textbox', {name: 'Enter your username'})).toBeInTheDocument()
        expect(screen.getByLabelText('Enter your username')).toBeInTheDocument()
    })
    test('a input password and his label', () => {
        render(<SignupPage/>)
        expect(screen.getByRole('textbox', {name: 'Enter your password'})).toBeInTheDocument()
        expect(screen.getByLabelText('Enter your password')).toBeInTheDocument()
    })
    test('a confirmPassword input and his label', () => {
        render(<SignupPage/>)
        expect(screen.getByRole('textbox', {name: 'Confirm your password'})).toBeInTheDocument()
        expect(screen.getByLabelText('Confirm your password')).toBeInTheDocument()
    })
    test('a button', () => {
        render(<SignupPage/>)
        expect(screen.getByRole('button', {name: 'Submit'}))
    })
})

describe('should be display the right message error', () => {
    test('if user type no input should be have an error', async () => {
        expect(screen.getByText('Your username must be alphanumeric'))
        expect(screen.getByText('Your password must overflow 8 characters'))
        expect(screen.getByText('your password must contains at least one non-alphanumeric character'))

    })
    test('if user type the wrong input it\'s should be display the message error', () => {

    })
})