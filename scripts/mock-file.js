const fs = require('fs');
const { join: joinPath } = require('path');

const mocks = [];
mocks;

function GET(path, query = {}, data) {
    const json = JSON.stringify(data, null, 4);
    const content = `HTTP/2 200
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Origin, Content-Type, Accept
Content-Type: application/json

${json}
`;
    const queryStringParts = [];
    for (const key in query) {
        const value = query[key];
        queryStringParts.push(`${key}=${value}`);
    }
    const queryString = queryStringParts.join('&');
    const separator = queryString ? '--' : '';
    const directory = joinPath(__dirname, '../mocks', path);
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(joinPath(directory, `GET${separator}${queryString}.mock`), content);
}


function POST(path, reqBody, resBody, isFirst) {
    const useCase = `#USE_CASE

#REQUEST
?

Content-Type: regex||^application\\/json

${JSON.stringify(reqBody)}
#END_REQUEST

#RESPONSE
HTTP/2 200
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE
Access-Control-Allow-Headers: Origin, Content-Type, Accept
Content-Type: application/json

${JSON.stringify(resBody)}
#END_RESPONSE

#END_USE_CASE


`;
    const directory = joinPath(__dirname, '../mocks', path);
    const filePath = joinPath(directory, 'POST.mock');
    if (isFirst && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    fs.mkdirSync(directory, { recursive: true });
    fs.appendFileSync(filePath, useCase);
}

function generateMocks() {
    // TODO
}

module.exports = {
    GET,
    POST,
    generateMocks,
};
