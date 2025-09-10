// export const toTitleCase = (str: string) => {
//   if (!str) return "";
//   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
// };
import slug from "slug";

export const toTitleCase = (str: string) => {
  if (!str) return ""; // kalau string kosong

  const words = str.toLowerCase().split("_");

  return words
    .map((word) => {
      if (!word) return ""; // kalau kata kosong
      return word[0].toUpperCase() + word.slice(1);
    })
    .join(" ");
};

export const toSEO = (text: string): string => {
  return slug(text.replace(/_/g, " "), { lower: true });
};
