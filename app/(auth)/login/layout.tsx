export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[480px]">
        {children}
      </div>
    </div>
  )
}
