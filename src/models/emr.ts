import { GRPCClient } from "../grpc/client";

export class EmrModel {

  async getPersonInfo(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getPerson(params, apiKey);
  }

  async getLastOpd(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getLastOpd(params, apiKey);
  }

  async getLastIpd(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getLastIpd(params, apiKey);
  }

}