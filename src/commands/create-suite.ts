import { QaseClient } from "../qase-client.js";

export async function createSuite(
  code: string,
  title: string,
  parentId?: number,
  description?: string
) {
  const client = new QaseClient();
  const body: Record<string, unknown> = { title };
  if (parentId !== undefined) {
    body.parent_id = parentId;
  }
  if (description !== undefined) {
    body.description = description;
  }
  const data = await client.post(`/suite/${code}`, body);
  console.log(JSON.stringify(data, null, 2));
  return data;
}
