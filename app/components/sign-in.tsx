import { signIn } from "@/auth";

export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server";
        await signIn("google");
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  );
}
