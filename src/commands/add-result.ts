import { QaseClient } from "../qase-client.js";

export async function addResult(
  code: string,
  runId: string,
  caseId: number,
  status: string
) {
  const client = new QaseClient();
  const data = await client.post(`/result/${code}/${runId}`, {
    case_id: caseId,
    status,
  });
  console.log(JSON.stringify(data, null, 2));
}
