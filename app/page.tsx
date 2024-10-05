import { signIn } from "@/auth";

export default async function IndexPage() {
  return (
    <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
        className="w-full max-w-md"
      >
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
