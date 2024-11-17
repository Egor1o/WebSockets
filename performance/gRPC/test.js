import { Client, Stream } from 'k6/net/grpc';
import { sleep } from 'k6';
import { open, SeekMode } from 'k6/experimental/fs';
import encoding from 'k6/encoding';

const file = await open('../../resources/10MB.bin', 'b');
const GRPC_ADDR = __ENV.GRPC_ADDR || 'localhost:50051';
const GRPC_PROTO_PATH = __ENV.GRPC_PROTO_PATH || '../../protocols/gRPC/.proto';
const client = new Client();
client.load([], GRPC_PROTO_PATH);

export let options ={
    vus:'100',
    duration: '10s',
    iterations: '100'
}

//k6 tests start with exported functions like this
export default async () => {
    if (__ITER == 0) {
        client.connect(GRPC_ADDR, { plaintext: true });
    }

    const stream = new Stream(client, 'Application/uploadFile');

    stream.on('data', (stats) => {
        console.log('data');

    });

    stream.on('error', (err) => {
        console.log('Stream Error: ' + JSON.stringify(err));
    });

    stream.on('end', () => {
        client.close();
        console.log('All done');
    });



    // Seek to the beginning of the file
    await file.seek(0, SeekMode.Start);

    //change to the file from arguments
    const fileinfo = await file.stat();
    if (fileinfo.name !== '10MB.bin') {
        throw new Error('Unexpected file name');
    }

    //needs to be adjusted.
    const buffer = new Uint8Array(64 * 1024 );

    let totalBytesRead = 0;
    while (true) {
        // Read into the buffer
        const bytesRead = await file.read(buffer);
        if (bytesRead == null) {
            // EOF
            break;
        }

        stream.write(
            {
                fileChunk: encoding.b64encode(buffer)
            }
        )

        // Do something useful with the content of the buffer
        totalBytesRead += bytesRead;
        console.log()

        // If bytesRead is less than the buffer size, we've read the whole file
        if (bytesRead < buffer.byteLength) {
            break;
        }
    }

    // Check that we read the expected number of bytes
    if (totalBytesRead !== fileinfo.size) {
        throw new Error('Unexpected number of bytes read');
    }

    stream.end();

    sleep(1);
};
