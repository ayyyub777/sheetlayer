import { Suspense } from "react"
import LoginForm from "./components/login-form"
import Loading from "@/app/loading"

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  )
}
