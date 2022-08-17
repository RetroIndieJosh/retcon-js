function is_hex(hex: string): boolean {
        const regex = new RegExp("[0-9a-fA-F]+");
        return regex.test(hex);
}

function hex_string(num: number): string {
        return num.toString(16);
}