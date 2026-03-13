import { QaseClient } from "../qase-client.js";

interface Step {
  action: string;
  expected_result?: string;
}

export async function createCase(
  code: string,
  title: string,
  suiteId?: number,
  description?: string,
  steps?: Step[]
) {
  const client = new QaseClient();
  const body: Record<string, unknown> = { title };
  if (suiteId !== undefined) {
    body.suite_id = suiteId;
  }
  if (description !== undefined) {
    body.description = description;
  }
  if (steps && steps.length > 0) {
    body.steps = steps;
  }
  const data = await client.post(`/case/${code}`, body);
  console.log(JSON.stringify(data, null, 2));
  return data;
}
