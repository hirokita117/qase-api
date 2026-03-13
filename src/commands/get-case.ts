import { QaseClient } from "../qase-client.js";

export async function getCase(code: string, id: string) {
  const client = new QaseClient();
  const data = await client.get(`/case/${code}/${id}`);
  console.log(JSON.stringify(data, null, 2));
}
