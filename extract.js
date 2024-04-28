const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

const filePath = path.join(__dirname, '/public/upload/test.pdf');
const dataBuffer = fs.readFileSync(filePath);

pdfParse(dataBuffer).then(function(data) {
    console.log(data.text);
});