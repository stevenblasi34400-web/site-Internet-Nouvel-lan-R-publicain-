import { useQuery } from "@tanstack/react-query";
import { getPublicPage } from "@/backend/admin.functions";
import type { PageContent, HomePageContent } from "@/lib/content-types";

/**
 * Charge une page éditable depuis le store administré, avec un fallback statique
 * fourni par l'appelant (préserve l'affichage si l'appel serveur échoue).
 */
export function useContentPage(key: string, fallback: PageContent) {
  return useQuery<PageContent>({
    queryKey: ["public-page", key],
    queryFn: () => getPublicPage({ data: { key } }),
    staleTime: 60_000,
    initialData: fallback,
  });
}

export function useHomePage(fallback: HomePageContent) {
  return useQuery<HomePageContent>({
    queryKey: ["public-page", "home"],
    queryFn: () => getPublicPage({ data: { key: "home" } }) as Promise<HomePageContent>,
    staleTime: 60_000,
    initialData: fallback,
  });
}
