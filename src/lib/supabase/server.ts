import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createServerClient(url, anonKey, {
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          next: { revalidate: 0 },
        }),
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll() {
        // No-op for MVP server components.
      },
    },
  });
}
