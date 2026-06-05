import { RegisterForm } from "@/components/register-form";

export default async function RegisterUserPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  return <RegisterForm role="user" error={params.error} message={params.message} />;
}
