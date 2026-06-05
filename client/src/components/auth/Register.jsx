import { useState } from 'react'
import { z } from 'zod'
import '../../App.css'

const registerSchema = z.object({
	fullName: z.string().min(3, 'Full name must be at least 3 characters long'),
	username: z.string().min(3, 'Username must be at least 3 characters long'),
	email: z.string().email('Please enter a valid email address'),
	password: z
		.string()
		.min(8, 'Password must be at least 8 characters long')
		.regex(/[A-Z]/, 'Password must include one uppercase letter')
		.regex(/[0-9]/, 'Password must include one number'),
})

const initialForm = {
	fullName: '',
	username: '',
	email: '',
	password: '',
}

function Register() {
	const [form, setForm] = useState(initialForm)
	const [errors, setErrors] = useState({})
	const [message, setMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [showPassword, setShowPassword] = useState(false)

	const handleChange = (event) => {
		const { name, value } = event.target

		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}))

		if (errors[name]) {
			setErrors((currentErrors) => ({
				...currentErrors,
				[name]: '',
			}))
		}
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setMessage('')

		const result = registerSchema.safeParse(form)

		if (!result.success) {
			const nextErrors = {}

			for (const issue of result.error.issues) {
				const fieldName = issue.path[0]
				if (typeof fieldName === 'string' && !nextErrors[fieldName]) {
					nextErrors[fieldName] = issue.message
				}
			}

			setErrors(nextErrors)
			return
		}

		setErrors({})
		setIsSubmitting(true)

		await new Promise((resolve) => setTimeout(resolve, 900))

		setIsSubmitting(false)
		setMessage(`Account created for ${result.data.fullName}.`)
		setForm(initialForm)
		setShowPassword(false)
	}

	return (
		<main className="login-shell">
			<section className="login-card register-card">
				<div className="login-hero">
					<h1>Register</h1>
					<span>Create your account in a few simple steps.</span>
				</div>

				<form className="login-form register-form" onSubmit={handleSubmit} noValidate>
					<div className="register-row">
						<label className="field">
							<p align="left">Full name</p>
							<input
								type="text"
								name="fullName"
								value={form.fullName}
								onChange={handleChange}
								placeholder="Enter your full name"
								autoComplete="name"
							/>
							{errors.fullName ? <small>{errors.fullName}</small> : null}
						</label>

						<label className="field">
							<p align="left">Username</p>
							<input
								type="text"
								name="username"
								value={form.username}
								onChange={handleChange}
								placeholder="Enter a username"
								autoComplete="username"
							/>
							{errors.username ? <small>{errors.username}</small> : null}
						</label>
					</div>

					<label className="field">
						<p align="left">Email address</p>
						<input
							type="email"
							name="email"
							value={form.email}
							onChange={handleChange}
							placeholder="Enter your email address"
							autoComplete="email"
						/>
						{errors.email ? <small>{errors.email}</small> : null}
					</label>

					<label className="field">
						<p align="left">Password</p>
						<div className="password-field">
							<input
								type={showPassword ? 'text' : 'password'}
								name="password"
								value={form.password}
								onChange={handleChange}
								placeholder="••••••••"
								autoComplete="new-password"
							/>
							<button
								type="button"
								className="password-toggle"
								onClick={() => setShowPassword((currentValue) => !currentValue)}
								aria-label={showPassword ? 'Hide password' : 'Show password'}
								aria-pressed={showPassword}
							>
								{showPassword ? (
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path d="M12 5c5.55 0 10.11 3.58 11.74 7-1.63 3.42-6.19 7-11.74 7S1.89 15.42.26 12C1.89 8.58 6.45 5 12 5Zm0 2C7.94 7 4.23 9.42 2.69 12 4.23 14.58 7.94 17 12 17s7.77-2.42 9.31-5C19.77 9.42 16.06 7 12 7Zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
									</svg>
								) : (
									<svg viewBox="0 0 24 24" aria-hidden="true">
										<path d="M2.1 3.51 3.51 2.1 21.9 20.49l-1.41 1.41-3.03-3.03A11.35 11.35 0 0 1 12 20C6.45 20 1.89 16.42.26 13c.73-1.53 1.92-3.05 3.46-4.34L2.1 3.51Zm5.05 5.05A8.93 8.93 0 0 0 2.69 12C4.23 14.58 7.94 17 12 17c1.09 0 2.15-.15 3.13-.44l-2.1-2.1a3 3 0 0 1-4.59-4.59L7.15 8.56Zm4.01 4.01 1.66 1.66a1 1 0 0 0-1.66-1.66Zm2.28-2.29 2.36 2.36A3 3 0 0 0 12 9c-.53 0-1.03.14-1.47.4l1.1 1.1c.1-.3.23-.45.81-.45.62 0 1.14.53 1.14 1.14 0 .58-.15.71-.24.79Z" />
									</svg>
								)}
							</button>
						</div>
						{errors.password ? <small>{errors.password}</small> : null}
					</label>

					<div className="password-guidelines">
						<ul>
							<li>8+ Characters</li>
							<li>Uppercase</li>
							<li>One Number</li>
						</ul>
					</div>

					<button className="login-button" type="submit" disabled={isSubmitting}>
						{isSubmitting ? 'Creating account...' : 'Create Account'}
					</button>

					<p className="signup-text">
						Already have an account? <a href="#login">Log in</a>
					</p>

					{message ? <p className="login-message">{message}</p> : null}
				</form>
			</section>
		</main>
	)
}

export default Register
