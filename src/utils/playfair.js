export const generatePlayfairMatrix = (keyword) => {
    keyword = keyword.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    const matrix = [];
    const used = new Set();
    
    // Add keyword letters
    for (const char of keyword) {
        if (!used.has(char)) {
            matrix.push(char);
            used.add(char);
        }
    }
    
    // Add remaining alphabet
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // No J
    for (const char of alphabet) {
        if (!used.has(char)) {
            matrix.push(char);
            used.add(char);
        }
    }
    return matrix; // Array of 25 characters
};

export const prepareText = (text) => {
    let cleanText = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let prepared = '';
    
    for (let i = 0; i < cleanText.length; i++) {
        prepared += cleanText[i];
        if (i + 1 < cleanText.length && cleanText[i] === cleanText[i + 1]) {
            prepared += 'X'; // Insert filler
        }
    }
    
    if (prepared.length % 2 !== 0) {
        prepared += 'X'; // Pad if odd
    }
    return prepared;
};

export const processPlayfair = (text, keyword, encrypt = true) => {
    const matrix = generatePlayfairMatrix(keyword);
    const preparedText = prepareText(text);
    let result = '';
    let steps = [];

    const getPos = (char) => {
        const index = matrix.indexOf(char);
        return { r: Math.floor(index / 5), c: index % 5 };
    };

    const shift = encrypt ? 1 : 4; // 4 is equivalent to -1 in mod 5

    for (let i = 0; i < preparedText.length; i += 2) {
        const c1 = preparedText[i];
        const c2 = preparedText[i + 1];
        const pos1 = getPos(c1);
        const pos2 = getPos(c2);
        
        let newC1, newC2, rule;

        if (pos1.r === pos2.r) {
            // Same row
            newC1 = matrix[pos1.r * 5 + (pos1.c + shift) % 5];
            newC2 = matrix[pos2.r * 5 + (pos2.c + shift) % 5];
            rule = 'Row';
        } else if (pos1.c === pos2.c) {
            // Same column
            newC1 = matrix[((pos1.r + shift) % 5) * 5 + pos1.c];
            newC2 = matrix[((pos2.r + shift) % 5) * 5 + pos2.c];
            rule = 'Column';
        } else {
            // Rectangle
            newC1 = matrix[pos1.r * 5 + pos2.c];
            newC2 = matrix[pos2.r * 5 + pos1.c];
            rule = 'Rectangle';
        }

        result += newC1 + newC2;
        steps.push({ pair: c1 + c2, encrypted: newC1 + newC2, rule });
    }

    return { result, steps, matrix };
};
