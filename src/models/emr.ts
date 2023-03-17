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

  /**
   * 
   * @param params {object} `hospcode` รหัสหน่วยบริการ, `seq` ลำดับที่รับบริการ}
   * @param apiKey {string} สำหรับเชื่อม gRPC ฝั่ง สสจ.
   * @param zoneEndpoint {string} gRPC server สสจ.
   * @returns 
   */
  async getOpdDiag(params: any, apiKey: any, zoneEndpoint: any): Promise<any> {
    const client = new GRPCClient(zoneEndpoint);
    return client.getOpdDiag(params, apiKey);
  }

}