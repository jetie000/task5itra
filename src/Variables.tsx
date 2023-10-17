export const variables = {
    // API_URL: "https://jetie000-001-site1.ctempurl.com/api",
    // PHOTO_URL: "https://jetie000-001-site1.ctempurl.com/Photos/",
    // SOCKET_URL : "wss://jetie000-001-site1.ctempurl.com/chat-hub",
    API_URL: "https://localhost:7121/api",
    $SEED: "seed",
    $REGION: "region",
    $MISTAKES_NUM: "mistakes_num",
    locales: ['en', 'ru', 'pl', 'de'],
    countryLocal: ['USA', 'Россия', 'Poland', 'Deuschland'],
    hashCode: (s: string) => {
        var h = 0, l = s.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
        return h;
    },
    mistakes: [
        (seed: number, str: string): string => {
            let index = Math.abs(variables.hashCode(seed + str)) % str.length;
            return str.slice(0, index).concat(str.slice(index + 1, str.length));
        },
        (seed: number, str: string, localeIndex: number): string => {
            let index: number = Math.abs(variables.hashCode(seed + str)) % str.length;
                return str.slice(0, index)
                    .concat(variables.letters[localeIndex][Math.abs(variables.hashCode(seed + str)) % variables.letters[localeIndex].length])
                    .concat(str.slice(index + 1, str.length));
        },
        (seed: number, str: string, localeIndex: number): string => {
            let index = Math.abs(variables.hashCode(seed + str)) % str.length;
            return str.slice(0, index)
                .concat(variables.letters[localeIndex][Math.abs(variables.hashCode(seed + str)) % variables.letters[localeIndex].length])
                .concat(str.slice(index, str.length));
        }
    ],
    letters:[
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ",
        "абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ ",
        "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźżAĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ ",
        "aäbcdefghijklmnoöpqrstuüvwxyzAÄBCDEFGHIJKLMNOÖPQRSTUÜVWXYZ ",
    ],
    MIN_MISTAKES: 0,
    MAX_MISTAKES: 100,
    MIN_SEED: 1,
    MAX_SEED: 9999999
}