import { RegisterForm } from "@/components/register-form";

export default async function RegisterWorkerPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const params = await searchParams;
  return <RegisterForm role="worker" error={params.error} message={params.message} />;
}
