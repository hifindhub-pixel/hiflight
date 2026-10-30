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
      if (layer.type !== 'symbol' || !layer.layout?.['text-field']) return layer;
      const field = JSON.stringify(layer.layout['text-field']);
      if (!/name(?::|_|\b)/.test(field)) return layer;
      return { ...layer, layout: { ...layer.layout, 'text-field': expression as ExpressionSpecification } };
    }),
  };
}
