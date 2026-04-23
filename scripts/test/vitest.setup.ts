import { readFile } from 'node:fs/promises';
import path from 'node:path';

import '../helperFiles/documentFunctions';

const repoRoot = process.cwd();
const originalFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = async (input, init) => {
    if (typeof input === 'string' && input.startsWith('JSON/')) {
        const filePath = path.join(repoRoot, input);
        const body = await readFile(filePath, 'utf8');
        return new Response(body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    return originalFetch(input, init);
};

(window as any).GetRequiredElementById = document.GetRequiredElementById.bind(document);