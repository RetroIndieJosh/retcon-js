const INVSQRT2 = 1/Math.sqrt(2);

function hex_string(num: number): string {
        return num.toString(16);
}

function is_hex(hex: string): boolean {
        const regex = new RegExp("[0-9a-fA-F]+");
        return regex.test(hex);
}