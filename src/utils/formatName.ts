export default function FormatName(name: string) {
    const nameParts = name.split(' ');

    return nameParts.map(part => {
        const eachLetter = part.split('');
        eachLetter[0] = eachLetter[0]?.toUpperCase();
        return eachLetter.join('');
    }).join(' ');
}