import { QaseClient } from "../qase-client.js";

export async function createRun(
  code: string,
  title: string,
  cases?: number[]
) {
  const client = new QaseClient();
  const body: Record<string, unknown> = { title };
  if (cases && cases.length > 0) {
    body.cases = cases;
  }
  const data = await client.post(`/run/${code}`, body);
  console.log(JSON.stringify(data, null, 2));
}
