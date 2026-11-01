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
      if (layer.type === 'background') return { ...layer, paint: { ...layer.paint, 'background-color': '#f5f4f0' } };
      if (layer.type === 'fill' && /water/.test(layer.id)) return { ...layer, paint: { ...layer.paint, 'fill-color': '#c4dfe8' } };
      if (layer.type === 'fill' && /building/.test(layer.id)) return { ...layer, paint: { ...layer.paint, 'fill-color': '#e4e2dc', 'fill-opacity': 0.65 } };
      if (layer.type === 'symbol' && /poi/.test(layer.id)) return { ...layer, minzoom: Math.max(layer.minzoom || 0, 15) };
      if (layer.type !== 'symbol' || !layer.layout?.['text-field']) return layer;
      const field = JSON.stringify(layer.layout['text-field']);
      if (!/name(?::|_|\b)/.test(field)) return layer;
      return { ...layer, layout: { ...layer.layout, 'text-field': expression as ExpressionSpecification } };
    }),
  };
}
