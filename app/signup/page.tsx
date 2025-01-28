import SignUpForm from "./SignUpForm"

export default function SignUp() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Sign Up</h1>
      <SignUpForm />
    </div>
  )
}

