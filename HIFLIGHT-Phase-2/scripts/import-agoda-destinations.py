"""Extract destination metadata only from a complete Agoda FR hotel ZIP.
Usage: python scripts/import-agoda-destinations.py /path/to/catalogue.zip
Streams CSV without unpacking hotel descriptions/photos into the repository.
"""
import csv, io, json, sys, zipfile
from collections import Counter, defaultdict
from datetime import datetime, timezone
from pathlib import Path

csv.field_size_limit(20_000_000)
root = Path(__file__).resolve().parents[1]
variants = defaultdict(Counter)
states = defaultdict(Counter)
records = skipped = 0
with zipfile.ZipFile(sys.argv[1]) as archive:
    files = [name for name in archive.namelist() if name.lower().endswith('.csv')]
    if len(files) != 1:
        raise ValueError('Expected exactly one CSV catalogue')
    # Reading to EOF also validates the ZIP entry CRC.
    with archive.open(files[0]) as stream:
        rows = csv.DictReader(io.TextIOWrapper(stream, encoding='utf-8-sig', newline=''))
        required = {'city_id', 'city', 'country', 'countryisocode', 'country_id', 'state'}
        if not required.issubset(rows.fieldnames or []):
            raise ValueError('Unexpected Agoda catalogue schema')
        for row in rows:
            records += 1
            try:
                city_id, country_id = int(row['city_id']), int(row['country_id'])
                name, country, code = (row[key].strip() for key in ('city', 'country', 'countryisocode'))
                if city_id <= 0 or country_id <= 0 or not name or not country or len(code) != 2:
                    raise ValueError('Invalid destination')
            except (ValueError, TypeError, AttributeError):
                skipped += 1
                continue
            variants[city_id][(name, country, code, country_id)] += 1
            if row.get('state', '').strip():
                states[city_id][row['state'].strip()] += 1
cities = []
conflicts = []
resolved = []
verified = {c['id']: c for c in json.loads((root/'lib/agoda/destinations.json').read_text())}
for city_id, choices in variants.items():
    # Never silently assign a country if the same ID has contradictory countries.
    if len({choice[3] for choice in choices}) > 1:
        if city_id in verified and any(v[3] == verified[city_id]['countryId'] for v in choices):
            choices = Counter({v: count for v, count in choices.items() if v[3] == verified[city_id]['countryId']})
            resolved.append(city_id)
        else:
            conflicts.append(city_id)
            continue
    (name, country, code, country_id), _ = choices.most_common(1)[0]
    city = dict(id=city_id, name=name, country=country, countryCode=code,
                countryId=country_id, hotelCount=sum(choices.values()))
    if states[city_id]:
        city['region'] = states[city_id].most_common(1)[0][0]
    aliases = sorted({v[0] for v in choices if v[0] != name})
    if aliases:
        city['aliases'] = aliases
    cities.append(city)
collisions = Counter((c['name'].casefold(), c['countryId']) for c in cities)
for city in cities:
    parts = [city['name']]
    if collisions[(city['name'].casefold(), city['countryId'])] > 1:
        parts.append(city.get('region') or f"zone {city['id']}")
    parts.append(city['country'])
    city['label'] = ', '.join(parts)
label_counts = Counter(c['label'] for c in cities)
for city in cities:
    if label_counts[city['label']] > 1:
        city['label'] += f" · zone {city['id']}"
cities.sort(key=lambda c: (c['name'].casefold(), c['country'], c['id']))
summary = dict(destinationCount=len(cities), countryCount=len({c['countryId'] for c in cities}),
               hotelRecords=records, skippedRecords=skipped, excludedCountryConflicts=conflicts, resolvedUsingVerifiedDestinations=resolved,
               importedAt=datetime.now(timezone.utc).isoformat(), source='Agoda hotel data FR (complete ZIP, CRC verified)')
if len(cities) < 1000:
    raise ValueError('Unexpectedly small catalogue; existing files preserved')
output = root/'lib/agoda'
(output/'destinations-full.json').write_text(json.dumps(cities, ensure_ascii=False, separators=(',', ':'))+'\n')
(output/'catalogue-summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(summary, ensure_ascii=False))
