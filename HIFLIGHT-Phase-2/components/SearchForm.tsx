"use client";

import { FormEvent, useState } from "react";
import { searchUrl } from "@/lib/content";
import { track } from "./Analytics";

type Props = {
  origin?: string;
  destination?: string;
  originCode?: string;
  destinationCode?: string;
  compact?: boolean;
};

const cityCodes: Record<string, string> = {
  paris: "PAR",
  lyon: "LYS",
  marseille: "MRS",
  nice: "NCE",
  toulouse: "TLS",
  bordeaux: "BOD",
  nantes: "NTE",
  barcelone: "BCN",
  madrid: "MAD",
  lisbonne: "LIS",
  londres: "LON",
  rome: "ROM",
  amsterdam: "AMS",
  bruxelles: "BRU",
  marrakech: "RAK",
  alger: "ALG",
  tunis: "TUN",
  dubai: "DXB",
  "dubaï": "DXB",
  "new york": "NYC",
  bangkok: "BKK",
  tokyo: "TYO",
};

function normalizeCity(value: string) {
  return value.trim().toLocaleLowerCase("fr-FR");
}

function resolveCode(
  value: string,
  initialValue: string,
  fixedCode: string,
) {
  const normalized = normalizeCity(value);

  if (
    fixedCode &&
    normalizeCity(initialValue) === normalized
  ) {
    return fixedCode;
  }

  if (/^[a-z]{3}$/i.test(normalized)) {
    return normalized.toUpperCase();
  }

  return cityCodes[normalized] || "";
}

function formatTravelpayoutsDate(value: string) {
  const parts = value.split("-");

  if (parts.length !== 3) {
    return "";
  }

  const [, month, day] = parts;

  return `${day}${month}`;
}

function getToday() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function SearchForm({
  origin = "",
  destination = "",
  originCode = "",
  destinationCode = "",
  compact = false,
}: Props) {
  const [from, setFrom] = useState(origin);
  const [to, setTo] = useState(destination);
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [error, setError] = useState("");

  const today = getToday();

  function swapRoute() {
    setFrom(to);
    setTo(from);
    setError("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const fromCode = resolveCode(from, origin, originCode);
    const toCode = resolveCode(
      to,
      destination,
      destinationCode,
    );

    if (!fromCode || !toCode) {
      setError(
        "Sélectionnez une ville proposée ou saisissez un code d’aéroport composé de trois lettres.",
      );
      return;
    }

    if (!departure) {
      setError("Sélectionnez une date de départ.");
      return;
    }

    if (returnDate && returnDate < departure) {
      setError(
        "La date de retour doit être postérieure à la date de départ.",
      );
      return;
    }

    const departureCode =
      formatTravelpayoutsDate(departure);

    const returnCode = returnDate
      ? formatTravelpayoutsDate(returnDate)
      : "";

    const flightSearch = returnDate
      ? `${fromCode}${departureCode}${toCode}${returnCode}1`
      : `${fromCode}${departureCode}${toCode}00`;

    track("search_started", {
      origin: fromCode,
      destination: toCode,
      source: window.location.pathname,
    });

    const target = new URL(searchUrl);

    target.pathname = "/";
    target.search = "";
    target.searchParams.set("flightSearch", flightSearch);

    if (adults !== "1") {
      target.searchParams.set("adults", adults);
    }

    target.searchParams.set("utm_source", "hiflight");
    target.searchParams.set("utm_medium", "seo_site");
    target.searchParams.set(
      "utm_campaign",
      "flight_search",
    );

    window.location.assign(target.toString());
  }

  return (
    <form
      id="recherche"
      className={`search-form ${compact ? "compact" : ""}`}
      onSubmit={submit}
    >
      <label>
        Départ
        <input
          required
          value={from}
          onChange={(event) => {
            setFrom(event.target.value);
            setError("");
          }}
          placeholder="Ville ou code IATA"
          list="hf-cities"
          autoComplete="off"
        />
      </label>

      <button
        className="swap"
        type="button"
        aria-label="Inverser le trajet"
        onClick={swapRoute}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 7h11l-3-3m3 3-3 3M17 17H6l3 3m-3-3 3-3" />
        </svg>
      </button>

      <label>
        Destination
        <input
          required
          value={to}
          onChange={(event) => {
            setTo(event.target.value);
            setError("");
          }}
          placeholder="Ville ou code IATA"
          list="hf-cities"
          autoComplete="off"
        />
      </label>

      <datalist id="hf-cities">
        {Object.entries(cityCodes).map(([city, code]) => (
          <option
            key={`${city}-${code}`}
            value={
              city.charAt(0).toUpperCase() + city.slice(1)
            }
          >
            {code}
          </option>
        ))}
      </datalist>

      <label>
        Aller
        <input
          required
          type="date"
          name="departure"
          min={today}
          value={departure}
          onChange={(event) => {
            const newDeparture = event.target.value;

            setDeparture(newDeparture);
            setError("");

            if (
              returnDate &&
              returnDate < newDeparture
            ) {
              setReturnDate("");
            }
          }}
        />
      </label>

      <label>
        Retour
        <input
          type="date"
          name="return"
          min={departure || today}
          value={returnDate}
          onChange={(event) => {
            setReturnDate(event.target.value);
            setError("");
          }}
        />
      </label>

      <label>
        Voyageurs
        <select
          value={adults}
          onChange={(event) =>
            setAdults(event.target.value)
          }
        >
          <option value="1">1 voyageur</option>
          <option value="2">2 voyageurs</option>
          <option value="3">3 voyageurs</option>
          <option value="4">4 voyageurs</option>
        </select>
      </label>

      <button
        className="search-button"
        type="submit"
      >
        Rechercher
      </button>

      <p
        className="form-note"
        role={error ? "alert" : undefined}
      >
        {error ||
          "Saisissez une ville proposée ou son code IATA. Vous poursuivrez sur le moteur HIFLIGHT propulsé par Travelpayouts."}
      </p>
    </form>
  );
}
