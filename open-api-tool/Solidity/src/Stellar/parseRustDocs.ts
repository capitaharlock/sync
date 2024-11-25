import * as fs from 'fs';
import * as path from 'path';
import * as cheerio from 'cheerio';

interface FunctionDetails {
    description: string;
    parameters: { name: string; description: string }[];
    returnType: string;
}

type DocumentationMap = { [functionName: string]: FunctionDetails };

// Load HTML file
function loadHtml(filePath: string): cheerio.CheerioAPI {
    const content = fs.readFileSync(filePath, 'utf8');
    return cheerio.load(content);
}

// Parse function documentation from an HTML file
function parseFunctionDocumentation($: cheerio.CheerioAPI): DocumentationMap {
    const functions: DocumentationMap = {};

    // Target function elements
    $('.impl-items .method-toggle').each((_, elem) => {
        const funcName = $(elem).find('.fn').text().trim();
        const description = $(elem).find('.docblock > p').first().text().trim();

        const parameters: { name: string; description: string }[] = [];
        $(elem).find('.docblock ul li').each((_, param) => {
            const paramName = $(param).find('code').text().trim();
            const paramDesc = $(param).text().replace(paramName, '').trim();
            parameters.push({ name: paramName, description: paramDesc });
        });

        const returnType = $(elem).find('.code-header').text().split('->').pop()?.trim() || 'void';

        functions[funcName] = {
            description: description,
            parameters: parameters,
            returnType: returnType,
        };
    });

    return functions;
}

// Recursively scan directory for HTML files and parse them
export function parseDocumentationDirectory(dirPath: string): DocumentationMap {
    const allFunctions: DocumentationMap = {};

    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            const subFunctions = parseDocumentationDirectory(filePath);
            Object.assign(allFunctions, subFunctions);
        } else if (file.endsWith('.html')) {
            const $ = loadHtml(filePath);
            const functions = parseFunctionDocumentation($);
            Object.assign(allFunctions, functions);
        }
    }

    return allFunctions;
}
