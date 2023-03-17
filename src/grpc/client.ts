import path from "path"
const grpc = require("@grpc/grpc-js")
const protoLoader = require("@grpc/proto-loader")

const PROTO_PATH = path.join(__dirname, "./emr.proto")

let packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  arrays: true
})

export class GRPCClient {

  client: any;

  constructor (endpoint: string) {
    const emr = grpc.loadPackageDefinition(packageDefinition).emr
    this.client = new emr.EmrService(endpoint, grpc.credentials.createInsecure());
  }

  getPerson(params: any, apiKey: any): Promise<any> {

    const jwtMetadata = new grpc.Metadata();
    jwtMetadata.add("Authorization", `Bearer ${apiKey}`);

    return new Promise((resolve: any, reject: any) => {
      this.client.getPerson(params, jwtMetadata, (err: any, response: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(response)
        }
      });
    });

  }
}
