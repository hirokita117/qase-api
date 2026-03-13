import { QaseClient } from "../qase-client.js";

export async function getCases(code: string) {
  const client = new QaseClient();
  const data = await client.get(`/case/${code}`);
  console.log(JSON.stringify(data, null, 2));
}
