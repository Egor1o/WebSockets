const protoLoader =  require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');
const path = require('path')
const fs = require('fs')
const PROTO_PATH = path.join(__dirname, '.proto');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const employee_proto = grpc.loadPackageDefinition(packageDefinition);

function main() {
    const client = new employee_proto.Application('localhost:50051', grpc.credentials.createInsecure());
    const filePath = path.join(__dirname, '../../resources/10MB.bin');
    const fileStream = fs.createReadStream(filePath);

    const call = client.uploadFile((error, response) => {
        if (error) {
            console.error('Error:', error);
        } else {
            console.log('Upload status:', response.message);
        }
    });

    fileStream.on('data', (chunk) => {
        call.write({ fileChunk: chunk });
    });

    fileStream.on('end', () => {
        call.end();
        console.log('File upload complete');
    });

    fileStream.on('error', (err) => {
        console.error('File read error:', err);
        call.end();
    });
}

main();
