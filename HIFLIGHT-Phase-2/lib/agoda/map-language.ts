import type { ExpressionSpecification, StyleSpecification } from 'maplibre-gl';

// Do not fall back to the native-script `name` field. An untranslated label
// without a Latin equivalent is omitted instead of displaying unreadable text.
export function frenchMapStyle(style: StyleSpecification): StyleSpecification {
  const fields = ['name:fr', 'name:latin', 'name:en'];
  const expression: unknown[] = ['case'];
  for (const field of fields) {
    expression.push(['!=', ['coalesce', ['get', field], ''], ''], ['get', field]);
  }
  expression.push('');
  return {
    ...style,
    layers: style.layers.map(layer => {
      // A quiet basemap leaves visual priority to hotel prices and street names.
      if (layer.type === 'background') return { ...layer, paint: { ...layer.paint, 'background-color': '#f6f5f1' } };
      if (layer.type === 'fill' && /water/.test(layer.id)) return { ...layer, paint: { ...layer.paint, 'fill-color': '#b8d8df' } };
      if (layer.type === 'fill' && /building/.test(layer.id)) return { ...layer, paint: { ...layer.paint, 'fill-color': '#deddd5', 'fill-opacity': 0.65 } };
      if (layer.type === 'fill' && /park|wood|grass|landcover/.test(layer.id)) return { ...layer, paint: { ...layer.paint, 'fill-color': '#dce6d8', 'fill-opacity': 0.7 } };
      // Hide commercial POIs at city scale, but still localize their labels below.
      if (layer.type === 'symbol' && /poi/.test(layer.id)) layer = { ...layer, minzoom: Math.max(layer.minzoom || 0, 16) };
      if (layer.type !== 'symbol' || !layer.layout?.['text-field']) return layer;
      const field = JSON.stringify(layer.layout['text-field']);
      if (!/name(?::|_|\b)/.test(field)) return layer;
      return { ...layer, layout: { ...layer.layout, 'text-field': expression as ExpressionSpecification } };
    }),
  };
}
