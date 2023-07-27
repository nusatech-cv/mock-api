const useCaseRegex = /#USE_CASE([\s\S]*?)#END_USE_CASE/g;
const requestRegex = /#REQUEST([\s\S]*?)#END_REQUEST/g;
const responseRegex = /#RESPONSE([\s\S]*?)#END_RESPONSE/g;

/**
 * @param {string} content
 * @returns {boolean}
 */
function isMockContainUseCases(content) {
    const isMockContainUseCases = content.includes('#USE_CASE') && content.includes('#END_USE_CASE');
    return isMockContainUseCases;
}

/**
 * @param {string} content
 */
function parseMockWithUseCases(content) {
    const useCaseMatches = content.match(useCaseRegex);

    if (useCaseMatches === null) {
        return [];
    }

    const useCases = useCaseMatches.map((useCaseMatch) => {
        const rawRequests = useCaseMatch.match(requestRegex);
        const rawResponses = useCaseMatch.match(responseRegex);

        const requests = rawRequests
            .map((rawRequest) => {
                const cleanedRawRequest = rawRequest.split('\n').slice(1, -1).join('\n');
                const [rawQuery, rawHeader, rawBody] = cleanedRawRequest.split('\n\n');

                const query = queryStringToObject(rawQuery);
                const headers = rawHeaderToObject(rawHeader);

                /** @type {any} */
                let body = rawBody;

                if (headers['content-type'] === 'application/json') {
                    body = JSON.parse(rawBody);
                }

                return { query, headers, body };
            });

        const responses = rawResponses
            .map((rawResponse) => {
                const cleanedRawResponse = rawResponse.split('\n').slice(1, -1).join('\n');

                return cleanedRawResponse;
            });

        return { requests, responses };
    });

    return useCases;
}

/**
 * @param {string} queryString
 */
function queryStringToObject(queryString) {
    const qs = new URLSearchParams(queryString ?? '');
    const query = {};
    qs.forEach((value, fullKey) => {
        const keyParts = fullKey.split('.');
        let pointer = query;
        keyParts.forEach((stringOrNumberKeyPart, index, keyParts) => {
            const isNumeric = /^\d+$/.test(stringOrNumberKeyPart);
            const keyPart = isNumeric ? parseInt(stringOrNumberKeyPart, 10) : stringOrNumberKeyPart;
            const latestItem = (keyParts.length - 1) === index;
            if (latestItem) {
                pointer[keyPart] = value;
            }
            else if (pointer[keyPart] === undefined) {
                pointer[keyPart] = {};
            }
            pointer = pointer[keyPart];
        });
    });
    return query;
}

/**
 * @param {string} rawHeader
 */
function rawHeaderToObject(rawHeader) {
    const headers = rawHeader
        .split('\n')
        .map((rawHeaderItem) => {
            const parts = rawHeaderItem.split(':');
            return parts;
        })
        .filter((parts) => parts.length > 1)
        .map(([key, ...values]) => {
            return { key: key.toLowerCase(), value: values.join(':').trim() };
        })
        .reduce((headers, { key, value }) => {
            if (headers[key] === undefined) {
                headers[key] = value;
            }
            else {
                headers[key] = [headers[key]];
            }
            if (Array.isArray(headers[key])) {
                headers[key].push(value);
            }
            return headers;
        }, {});

    return headers;
}

module.exports = {
    isMockContainUseCases,
    parseMockWithUseCases,
};
