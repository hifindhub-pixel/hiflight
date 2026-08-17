const providerStyle: Record<string, { short: string; tone: string }> = {
  "Booking.com": { short: "B", tone: "booking" },
  Expedia: { short: "E", tone: "expedia" },
  "Hotels.com": { short: "H", tone: "hotels" },
  "Trip.com": { short: "T", tone: "trip" },
  Rentalcars: { short: "R", tone: "rentalcars" },
  DiscoverCars: { short: "D", tone: "discovercars" },
};

export default function ProviderBadge({ provider }: { provider: string }) {
  const brand = providerStyle[provider] || { short: provider.slice(0, 1), tone: "default" };
  return <span className={`provider-logo provider-logo-${brand.tone}`} aria-hidden="true">{brand.short}</span>;
}
