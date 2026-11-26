/** Typographie française : espace insécable avant « : ; ? ! » et dans les guillemets, pour qu’une ligne ne commence jamais par un deux-points ou un point d’interrogation. */
export const fr = (text: string) => text.replace(/ ([:;?!»])/g, " $1").replace(/« /g, "« ");
