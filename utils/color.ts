import { RGBA } from '@google/model-viewer/lib/model-viewer';

function hexToRgbA(hex: string): RGBA {
  let c: any;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = `0x${c.join('')}`;
    // eslint-disable-next-line no-bitwise
    return [((c >> 16) & 255) / 255, ((c >> 8) & 255) / 255, (c & 255) / 255, 1];
  }
  throw new Error('Bad Hex');
}

function rgbaToHex(rgba: RGBA | undefined): string | undefined {
  if (rgba === undefined) return undefined;
  const [r, g, b] = rgba;
  let hex = '#';
  hex += (r * 255).toString(16);
  hex += (g * 255).toString(16);
  hex += (b * 255).toString(16);

  return hex;
}

export {
  hexToRgbA,
  rgbaToHex,
};
