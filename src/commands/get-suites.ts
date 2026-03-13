import { QaseClient } from "../qase-client.js";

export async function getSuites(code: string) {
  const client = new QaseClient();
  const data = await client.get(`/suite/${code}`);
  console.log(JSON.stringify(data, null, 2));
}
