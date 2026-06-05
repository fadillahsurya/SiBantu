"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input, Label } from "@/components/ui/field";

export function PasswordField({ label = "Password", name = "password" }: { label?: string; name?: string }) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <Label>{label}</Label>
      <div className="relative">
        <Input
          name={name}
          type={visible ? "text" : "password"}
          required
          minLength={6}
          placeholder="Minimal 6 karakter"
          className="pr-11"
        />
        <button
          type="button"
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-zinc-500 transition hover:text-zinc-950"
          onClick={() => setVisible((value) => !value)}
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}
