/**
 * Photos de villes (libres de droits) par code de destination.
 * Les villes absentes de la liste affichent un visuel de repli (voir FavoritesExperience).
 */
const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=720&q=70`;

export const cityPhotos: Record<string, string> = {
  RAK: unsplash("1597212618440-806262de4f6b"),
  BCN: unsplash("1583422409516-2895a77efded"),
  LIS: unsplash("1585208798174-6cedd86e019a"),
  BKK: unsplash("1562602833-0f4ab2fc46e3"),
  PTP: unsplash("1661381082632-87fd1727bf58"),
  ROM: unsplash("1515542622106-78bda8ba0e5b"),
  LON: unsplash("1486299267070-83823f5448dd"),
  IST: unsplash("1589561454226-796a8aa89b05"),
  MAD: unsplash("1539037116277-4db20889f2d4"),
  NYC: unsplash("1496588152823-86ff7695e68f"),
  DXB: unsplash("1512453979798-5ea266f8880c"),
  TUN: unsplash("1607869861980-da5f9b8b4969"),
  AMS: unsplash("1754835143820-bcf20e2e1a35"),
};
