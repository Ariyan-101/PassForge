export type PasswordSettings = {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
};

export type CharacterPool = {
  groups: string[];
  combined: string;
  size: number;
};

const CHARACTER_SETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/\\|~`'\"<>",
} as const;

const SIMILAR_CHARACTERS = /[O0Il]/g;
const AMBIGUOUS_SYMBOLS = /[\[\]{}()<>/\\|`'"~,;:.]/g;

export function getCharacterPool(settings: PasswordSettings): CharacterPool {
  const selected = [
    settings.uppercase ? CHARACTER_SETS.uppercase : "",
    settings.lowercase ? CHARACTER_SETS.lowercase : "",
    settings.numbers ? CHARACTER_SETS.numbers : "",
    settings.symbols ? CHARACTER_SETS.symbols : "",
  ];

  const groups = selected
    .filter(Boolean)
    .map((group) => {
      let usable = group;
      if (settings.excludeSimilar) usable = usable.replace(SIMILAR_CHARACTERS, "");
      if (settings.excludeAmbiguous) usable = usable.replace(AMBIGUOUS_SYMBOLS, "");
      return usable;
    })
    .filter(Boolean);

  const combined = groups.join("");
  return { groups, combined, size: combined.length };
}

/** Rejection sampling avoids modulo bias when mapping Web Crypto bytes to an index. */
function secureIndex(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive < 1 || maxExclusive > 256) {
    throw new RangeError("The character pool must contain between 1 and 256 characters.");
  }
  const ceiling = Math.floor(256 / maxExclusive) * maxExclusive;
  const byte = new Uint8Array(1);
  let value: number;
  do {
    globalThis.crypto.getRandomValues(byte);
    value = byte[0];
  } while (value >= ceiling);
  return value % maxExclusive;
}

function secureShuffle<T>(items: T[]): T[] {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const swapIndex = secureIndex(index + 1);
    [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
  }
  return items;
}

export function generatePassword(settings: PasswordSettings): string {
  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure password generation is unavailable in this browser.");
  }
  if (!Number.isInteger(settings.length) || settings.length < 8 || settings.length > 64) {
    throw new RangeError("Password length must be between 8 and 64 characters.");
  }

  const { groups, combined } = getCharacterPool(settings);
  if (!groups.length || !combined.length) {
    throw new Error("Select at least one character set to generate a password.");
  }
  if (groups.length > settings.length) {
    throw new Error("Password length is too short for the selected character sets.");
  }

  const characters = groups.map((group) => group[secureIndex(group.length)]);
  while (characters.length < settings.length) {
    characters.push(combined[secureIndex(combined.length)]);
  }
  return secureShuffle(characters).join("");
}

export function estimateEntropy(settings: PasswordSettings): number {
  const { size } = getCharacterPool(settings);
  if (!size || !Number.isInteger(settings.length) || settings.length < 1) return 0;
  return settings.length * Math.log2(size);
}
