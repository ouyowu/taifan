type ImageFocusVariant = "hero" | "wide" | "poster" | "square" | "avatar";

const IMAGE_FOCUS_RULES: Array<{
  match: string;
  positions: Record<ImageFocusVariant, string>;
}> = [
  {
    match: "bright-vachirawit",
    positions: {
      hero: "center 18%",
      wide: "center 16%",
      poster: "center 18%",
      square: "center 20%",
      avatar: "center 20%",
    },
  },
  {
    match: "win-metawin",
    positions: {
      hero: "center 14%",
      wide: "center 12%",
      poster: "center 16%",
      square: "center 18%",
      avatar: "center 18%",
    },
  },
  {
    match: "billkin",
    positions: {
      hero: "center 18%",
      wide: "center 16%",
      poster: "center 18%",
      square: "center 20%",
      avatar: "center 20%",
    },
  },
  {
    match: "pp-krit",
    positions: {
      hero: "center 12%",
      wide: "center 10%",
      poster: "center 14%",
      square: "center 18%",
      avatar: "center 18%",
    },
  },
  {
    match: "gemini-norawit",
    positions: {
      hero: "center 16%",
      wide: "center 14%",
      poster: "center 18%",
      square: "center 18%",
      avatar: "center 18%",
    },
  },
  {
    match: "fourth-nattawat",
    positions: {
      hero: "center 14%",
      wide: "center 12%",
      poster: "center 16%",
      square: "center 18%",
      avatar: "center 18%",
    },
  },
  {
    match: "lingling-kwong",
    positions: {
      hero: "center 16%",
      wide: "center 14%",
      poster: "center 18%",
      square: "center 20%",
      avatar: "center 20%",
    },
  },
  {
    match: "orm-kornnaphat",
    positions: {
      hero: "center 16%",
      wide: "center 14%",
      poster: "center 18%",
      square: "center 20%",
      avatar: "center 20%",
    },
  },
];

const DEFAULT_POSITIONS: Record<ImageFocusVariant, string> = {
  hero: "center 18%",
  wide: "center 16%",
  poster: "center 20%",
  square: "center 20%",
  avatar: "center 20%",
};

export function getImageObjectPosition(
  src: string | null | undefined,
  variant: ImageFocusVariant = "poster",
): string {
  if (!src) return DEFAULT_POSITIONS[variant];
  const rule = IMAGE_FOCUS_RULES.find((item) => src.includes(item.match));
  return rule?.positions[variant] ?? DEFAULT_POSITIONS[variant];
}
