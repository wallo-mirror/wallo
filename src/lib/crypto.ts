export function generateRandomHex(length: number): string {
	function convertToHex(value: number, length: number): string {
		return value.toString(16).padStart(length, '0');
	}

	function convertUint8ArrayToHex(values: Uint8Array): string {
		return [...values].map((v) => convertToHex(v, 2)).join('');
	}

	const values = new Uint8Array(length / 2);
	crypto.getRandomValues(values);

	return convertUint8ArrayToHex(values);
}

export function timingSafeEqual(a: string, b: string): boolean {
	if (a.length !== b.length) {
		return false;
	}

	const encoder = new TextEncoder();

	const aEncoded = encoder.encode(a);
	const bEncoded = encoder.encode(b);

	if (aEncoded.byteLength !== bEncoded.byteLength) return false;

	return crypto.subtle.timingSafeEqual(aEncoded, bEncoded);
}
