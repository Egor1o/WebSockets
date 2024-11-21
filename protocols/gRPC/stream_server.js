
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const {join} = require("node:path");
const {createWriteStream} = require("node:fs");
const PROTO_PATH = join(__dirname, '.proto');
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

function uploadFile(call, callback) {
    const savePath = join(__dirname, 'uploaded_file.bin');
    const writeStream = createWriteStream(savePath);

    call.on('data', (data) => {
        if (data.fileChunk) {
            writeStream.write(data.fileChunk);
        }
    });

    call.on('end', () => {
        writeStream.end();

        console.log('File received and saved to downloads folder');
        callback(null, { message: 'upload succ' }); // Send confirmation to client
    });

    call.on('error', (err) => {
        console.error('Stream error:', err);
        writeStream.end();
        callback(err);
    });
}

function main() {
    const server = new grpc.Server();
    server.addService(employee_proto.Application.service, { uploadFile });
    server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
        console.log("Server started");
    });
}

main();
