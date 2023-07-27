const fs = require('fs');
const path = require('path');
const URL = require('url');

const parsePath = path.parse;
const join = path.join;
const normalizeHeader = require('header-case-normalizer');
const Combinatorics = require('js-combinatorics');

const { isMockContainUseCases, parseMockWithUseCases } = require('./mock-with-use-case.js');

/** @typedef {import('node:http').IncomingMessage} IncomingMessage */
/** @typedef {import('node:http').ServerResponse} ServerResponse */

/**
 * Returns the status code out of the
 * first line of an HTTP response
 * (ie. HTTP/1.1 200 Ok)
 */
function parseStatus(header) {
    return header.split(' ')[1];
}

/**
 * Parses an HTTP header, splitting
 * by colon.
 */
const parseHeader = function (header) {
    header = header.split(': ');

    /**
     * To handle case where header value is JSON
     */
    const headerValue = header.slice(1).join(': ');

    return { key: normalizeHeader(header[0]), value: parseValue(headerValue) };
};

const parseValue = function (value) {
    if (/^#header/m.test(value)) {
        return value.replace(/^#header (.*);/m, function (statement, val) {
            const expression = val.replace(/[${}]/g, '');
            return eval(expression);
        }).replace(/\r\n?/g, '\n');
    }
    return value;
};

/**
 * Prepares headers to watch, no duplicates, non-blanks.
 * Priority exports over ENV definition.
 */
const prepareWatchedHeaders = function () {
    const exportHeaders = module.exports.headers && module.exports.headers.toString();
    const headers = (exportHeaders || process.env.MOCK_HEADERS || '').split(',');

    return headers.filter(function (item, pos, self) {
        return item && self.indexOf(item) == pos;
    });
};

/**
 * Parser the content of a mockfile
 * returning an HTTP-ish object with
 * status code, headers and body.
 */
const parse = function (content, file, request) {
    request;
    const headers = {};
    let body;
    const bodyContent = [];
    content = content.split(/\r?\n/);
    const status = parseStatus(content[0]);
    let headerEnd = false;
    delete content[0];

    content.forEach(function (line) {
        switch (true) {
        case headerEnd:
            bodyContent.push(line);
            break;
        case (line === '' || line === '\r'):
            headerEnd = true;
            break;
        default:
            var header = parseHeader(line);
            headers[header.key] = header.value;
            break;
        }
    });

    body = bodyContent.join('\n');

    if (/^#import/m.test(body)) {
        const context = path.parse(file).dir + '/';

        body = body.replace(/^#import (.*);/m, function (includeStatement, file) {
            const importThisFile = file.replace(/['"]/g, '');
            const content = fs.readFileSync(path.join(context, importThisFile));
            if (importThisFile.endsWith('.js')) {
                return JSON.stringify(eval(content.toString()));
            }
            else {
                return content;
            }
        })
            .replace(/\r\n?/g, '\n');
    }

    Object.keys(process.env).forEach((key) => {
        body = body.replace(new RegExp(`{{${key}}}`, 'g'), process.env[key]);
    });

    return { status: status, headers: headers, body: body };
};

function removeBlanks(array) {
    return array.filter(function (i) {
        return i;
    });
}

function getWildcardPath(dir) {
    let steps = removeBlanks(dir.split('/'));
    let testPath;
    let newPath;
    let exists = false;

    while (steps.length) {
        steps.pop();
        testPath = join(steps.join('/'), '/__');
        exists = fs.existsSync(join(mockserver.directory, testPath));
        if (exists) {
            newPath = testPath;
        }
    }

    const res = getDirectoriesRecursive(mockserver.directory).filter(dir => {
        const directories = dir.split(path.sep);
        return directories.includes('__');
    }).sort((a, b) => {
        const aLength = a.split(path.sep);
        const bLength = b.split(path.sep);

        if (aLength == bLength)
            return 0;

        // Order from longest file path to shortest.
        return aLength > bLength ? -1 : 1;
    }).map(dir => {
        const steps = dir.split(path.sep);
        const baseDir = mockserver.directory.split(path.sep);
        steps.splice(0, baseDir.length);
        return steps.join(path.sep);
    });

    steps = removeBlanks(dir.split('/'));

    newPath = matchWildcardPaths(res, steps) || newPath;

    return newPath;
}

function matchWildcardPaths(res, steps) {
    for (let resIndex = 0; resIndex < res.length; resIndex++) {
        const dirSteps = res[resIndex].split(/\/|\\/);
        if (dirSteps.length !== steps.length) {
            continue;
        }
        const result = matchWildcardPath(steps, dirSteps);
        if (result) {
            return result;
        }
    }
    return null;
}

function matchWildcardPath(steps, dirSteps) {
    for (let stepIndex = 1; stepIndex <= steps.length; stepIndex++) {
        const step = steps[steps.length - stepIndex];
        const dirStep = dirSteps[dirSteps.length - stepIndex];
        if (step !== dirStep && dirStep != '__') {
            return null;
        }
    }
    return '/' + dirSteps.join('/');
}

function flattenDeep(directories) {
    return directories.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
}

function getDirectories(srcpath) {
    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
        .filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
    const nestedDirectories = getDirectories(srcpath).map(getDirectoriesRecursive);
    const directories = flattenDeep(nestedDirectories);
    directories.push(srcpath);
    return directories;
}

/**
 * Returns the body or query string to be used in
 * the mock name.
 * 
 * In any case we will prepend the value with a double
 * dash so that the mock files will look like:
 * 
 * POST--My-Body=123.mock
 * 
 * or
 * 
 * GET--query=string&hello=hella.mock
 */
// POST--email=accountant@barong.io&password=123123&data.address=111
function getObjectPath(instance, parentName) {
    let result = '';

    Object.keys(instance).forEach(key => {
        const value = instance[key];
        const formatKey = parentName ? `${parentName}.${key}` : key;

        if (typeof value === 'object') {
            result += getObjectPath(value, formatKey);
        }
        else {
            const encodedValue = encodeURIComponent(value);
            result += `&${formatKey}=${encodedValue}`;
        }
    });

    return result;
}


function getBodyOrQueryString(body, query) {
    if (query) {
        return '--' + query;
    }

    if (body && body !== '') {
        try {
            let obj = eval('(' + body + ')');
            const path = getObjectPath(obj);
            return '--' + path.replace(/^&/gi, '');
        }
        catch (error) {
            console.log('[Body parse error]', error);
        }

        return '--' + body;
    }

    return body;
}

/**
 * Ghetto way to get the body
 * out of the request.
 * 
 * There are definitely better
 * ways to do this (ie. npm/body
 * or npm/body-parser) but for
 * the time being this does it's work
 * (ie. we don't need to support
 * fancy body parsing in mockserver
 * for now).
 */
function getBody(req, callback) {
    let body = '';

    req.on('data', function (b) {
        body = body + b.toString();
    });

    req.on('end', function () {
        callback(body);
    });
}

getMockedContent;
/**
 * fungsi matching lama
 */
function getMockedContent(path, prefix, body, query) {
    const mockName = prefix + (getBodyOrQueryString(body, query) || '') + '.mock';
    const mockFile = join(mockserver.directory, path, mockName);
    let content;

    try {
        content = fs.readFileSync(mockFile, { encoding: 'utf8' });
        if (mockserver.verbose) {
            console.log('Reading from ' + mockFile.yellow + ' file: ' + 'Matched'.green);
        }
    }
    catch (err) {
        if (mockserver.verbose) {
            console.log('Reading from ' + mockFile.yellow + ' file: ' + 'Not matched'.red);
        }
        content = (body || query) && getMockedContent(path, prefix);
    }

    return content;
}

function getContentFromPermutations(reqPath, reqMethod, reqHeaders, reqBody, reqQueryString, permutations) {

    const reqQuery = queryStringToObject(reqQueryString);

    let prefix = reqMethod;
    let content = getMockContentWithUseCases(reqPath, reqQuery, reqMethod, reqHeaders, reqBody);

    if (!content) while (permutations.length) {
        const permutation = permutations.pop().join('');
        if (permutation) {
            console.warn({ permutation });
        }
        prefix = reqMethod + permutation;
        content = getMatchedMockFileContent(reqPath, reqQuery, reqBody, reqMethod);
    }

    return { content: content, prefix: prefix };
}

/**
 * @param {string} relPath
 * @param {object} reqQuery
 * @param {string} reqBody
 * @param {string} reqMethod
 */
function getMatchedMockFileContent(relPath, reqQuery, reqBody, reqMethod) {
    const absDir = join(__dirname, relPath);

    if (!fs.existsSync(absDir)) {
        return false;
    }

    const stat = fs.statSync(absDir);

    if (!stat.isDirectory()) {
        return false;
    }

    try {
        reqBody = JSON.parse(reqBody);
    }
    catch {
        // ignore
    }

    const filenames = fs.readdirSync(absDir);
    const handlers = filenames
        .map((filename) => {
            const [mockMethod, mockQueryString] = filename.replace('.mock', '').split('--');
            return { filename, mockMethod, mockQueryString };
        })
        .filter(({ mockMethod }) => {
            return mockMethod === reqMethod;
        })
        .map(({ filename, mockMethod, mockQueryString }) => {
            const mockQuery = queryStringToObject(mockQueryString);
            return { filename, mockMethod, mockQuery };
        })
        .filter(({ mockQuery }) => {
            return (deepCompareLeft(mockQuery, reqQuery) && deepCompareLeft(reqQuery, mockQuery))
                || (deepCompareLeft(mockQuery, reqBody) && deepCompareLeft(reqQuery, reqBody));
        });

    if (handlers.length === 0) {
        return false;
    }

    const handler = handlers[0];

    const handlerPath = join(absDir, handler.filename);

    const content = fs.readFileSync(handlerPath, { encoding: 'utf-8' });

    return content;
}

/**
 * @param {string} relPath
 * @param {object} reqQuery
 * @param {string} reqMethod
 * @param {object} reqHeaders
 * @param {string} reqBody
 */
function getMockContentWithUseCases(relDir, reqQuery, reqMethod, reqHeaders, reqBody) {
    const mockPath = join(__dirname, relDir, `${reqMethod}.mock`);

    if (!fs.existsSync(mockPath)) {
        return false;
    }

    const stat = fs.statSync(mockPath);

    if (!stat.isFile()) {
        return false;
    }

    const mockContent = fs.readFileSync(mockPath, { encoding: 'utf-8' });

    if (!isMockContainUseCases(mockContent)) {
        return false;
    }

    const useCases = parseMockWithUseCases(mockContent);

    const matchedUseCase = useCases
        .find((useCase) => {
            for (const useCaseRequest of useCase.requests) {
                const isQueryMatch = deepCompareLeft(useCaseRequest.query, reqQuery);
                const isHeaderMatch = deepCompareLeft(useCaseRequest.headers, reqHeaders);

                let isBodyMatch = false;

                if (reqHeaders['content-type']?.includes('application/json')) try {
                    const bodyObject = JSON.parse(reqBody);
                    const mockBodyObject = typeof useCaseRequest.body === 'string'
                        ? JSON.parse(useCaseRequest.body)
                        : useCaseRequest.body;
                    isBodyMatch = deepCompareLeft(mockBodyObject, bodyObject);
                }
                catch (error) {
                    return false;
                }

                if (isQueryMatch && isHeaderMatch && isBodyMatch) {
                    return true;
                }
            }

            return false;
        });

    if (matchedUseCase === undefined || matchedUseCase.responses.length === 0) {
        return false;
    }

    return matchedUseCase.responses[0];
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
 * @param {object} left
 * @param {object} right
 * @returns {boolean}
 */
function deepCompareLeft(left, right) {
    if (isObject(left) && isObject(right)) {
        const leftKeys = Object.keys(left);
        for (const leftKey of leftKeys) {
            const leftValue = right[leftKey];
            const rightValue = left[leftKey];
            if (!deepCompareLeft(leftValue, rightValue)) {
                return false;
            }
        }
        return true;
    }
    if (typeof left === 'string' && left.startsWith('regex|')) {
        const [flag, ...regexStrs] = left.split('|').slice(1);
        const regex = new RegExp(regexStrs.join('|'), flag);
        const test = regex.test(right);
        return test;
    }
    if (typeof right === 'string' && right.startsWith('regex|')) {
        const [flag, ...regexStrs] = right.split('|').slice(1);
        const regex = new RegExp(regexStrs.join('|'), flag);
        const test = regex.test(left);
        return test;
    }
    return left === right;
}

function isObject(value) {
    return typeof value === 'object' && value !== null;
}


const mockserver = {
    directory: '.',
    verbose: false,
    headers: [],
    init: function (directory, verbose) {
        this.directory = directory;
        this.verbose = !!verbose;
        this.headers = prepareWatchedHeaders();
    },
    /**
     * @param {IncomingMessage} req
     * @param {ServerResponse} res
     */
    handle: function (req, res) {
        const xAuthToken = process.env?.HTTP_X_AUTH_TOKEN;
        if (typeof xAuthToken === 'string' && xAuthToken.length !== 0) {
            const authorization = req.headers['x-auth-token'];
            if (authorization !== xAuthToken) {
                res.writeHead(401);
                res.end('Unauthorized');
                return;
            }
        }

        getBody(req, function (body) {
            try {
                req.body = body;
                const url = req.url;
                let path = url;

                const queryIndex = url.indexOf('?'),
                    query = queryIndex >= 0 ? url.substring(queryIndex).replace(/\?/g, '') : '',
                    method = req.method.toUpperCase(),
                    headers = [];

                if (queryIndex > 0) {
                    path = url.substring(0, queryIndex);
                }

                if (req.headers && mockserver.headers.length) {
                    mockserver.headers.forEach(function (header) {
                        header = header.toLowerCase();
                        if (req.headers[header]) {
                            headers.push('_' + normalizeHeader(header) + '=' + req.headers[header]);
                        }
                    });
                }

                // Now, permute the possible headers, and look for any matching files, prioritizing on
                // both # of headers and the original header order
                let matched,
                    permutations = [[]];

                if (headers.length) {
                    permutations = Combinatorics.permutationCombination(headers).toArray().sort(function (a, b) {
                        return b.length - a.length;
                    });
                    permutations.push([]);
                }

                matched = getContentFromPermutations(path, method, req.headers, body, query, permutations.slice(0));

                if (!matched.content && (path = getWildcardPath(path))) {
                    matched = getContentFromPermutations(path, method, req.headers, body, query, permutations.slice(0));
                }

                if (matched.content) {
                    const mock = parse(matched.content, join(mockserver.directory, path, matched.prefix), req);

                    if (mock.status === undefined) {
                        res.writeHead(500);
                        res.end(mock.body);
                        return;
                    }

                    res.writeHead(mock.status, mock.headers);
                    res.end(mock.body);
                    return;
                }

                if (handleOpenApiDoc(req, res)) {
                    return;
                }

                if (handleStaticFiles(req, res)) {
                    return;
                }

                res.writeHead(404);
                res.end('Mock or file does not exists');
            }
            catch (error) {
                console.error(error);
            }
        });
    },
};

/**
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} req
 * @returns {boolean}
 */
function handleOpenApiDoc(req, res) {
    if (req.url.indexOf('/openapi.json') !== -1) {
        const readStream = fs.createReadStream(join(__dirname, '../openapi/openapi.json'));
        res.setHeader('Content-type', 'application/json');
        readStream.pipe(res);
        return true;
    }

    return false;
}

/**
 * @param {IncomingMessage} req
 * @param {OutgoingMessage} req
 * @returns {boolean}
 */
function handleStaticFiles(req, res) {
    const parsedUrl = URL.parse(req.url);
    let filepath = join(__dirname, '../public', parsedUrl.pathname);
    const ext = parsePath(filepath).ext;
    const map = {
        '.ico': 'image/x-icon',
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.json': 'application/json',
        '.css': 'text/css',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.wav': 'audio/wav',
        '.mp3': 'audio/mpeg',
        '.svg': 'image/svg+xml',
        '.pdf': 'application/pdf',
        '.doc': 'application/msword',
    };

    const fileExists = fs.existsSync(filepath);

    if (fileExists && fs.statSync(filepath).isFile()) {
        console.log(`Reading file ${filepath}`);
        const readStream = fs.createReadStream(filepath);
        res.setHeader('Content-type', map[ext] || 'text/plain');
        readStream.pipe(res);
        return true;
    }

    return false;
}

module.exports = function (directory, silent) {
    mockserver.init(directory, silent);

    return mockserver.handle;
};

module.exports.headers = null;
module.exports.parse = parse;
module.exports.getBodyOrQueryString = getBodyOrQueryString;
