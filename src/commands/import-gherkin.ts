import { readFileSync } from "node:fs";
import { QaseClient } from "../qase-client.js";

interface Step {
  action: string;
}

interface ScenarioOutline {
  title: string;
  steps: Step[];
  exampleHeaders: string[];
  exampleRows: string[][];
}

interface Scenario {
  title: string;
  steps: Step[];
}

interface ParsedFeature {
  title: string;
  scenarios: Scenario[];
  scenarioOutlines: ScenarioOutline[];
}

function parseFeatureFile(content: string): ParsedFeature {
  const lines = content.split("\n").map((l) => l.trim());
  let featureTitle = "";
  const scenarios: Scenario[] = [];
  const scenarioOutlines: ScenarioOutline[] = [];

  let current: { type: "scenario" | "outline"; title: string; steps: Step[] } | null = null;
  let inExamples = false;
  let exampleHeaders: string[] = [];
  let exampleRows: string[][] = [];

  for (const line of lines) {
    if (line.startsWith("Feature:")) {
      featureTitle = line.replace(/^Feature:\s*/, "");
      continue;
    }

    if (line.startsWith("Scenario Outline:") || line.startsWith("Scenario Template:")) {
      if (current) {
        flushCurrent();
      }
      current = {
        type: "outline",
        title: line.replace(/^Scenario (Outline|Template):\s*/, ""),
        steps: [],
      };
      inExamples = false;
      exampleHeaders = [];
      exampleRows = [];
      continue;
    }

    if (line.startsWith("Scenario:")) {
      if (current) {
        flushCurrent();
      }
      current = {
        type: "scenario",
        title: line.replace(/^Scenario:\s*/, ""),
        steps: [],
      };
      inExamples = false;
      continue;
    }

    if (line.startsWith("Examples:")) {
      inExamples = true;
      continue;
    }

    if (inExamples && line.startsWith("|")) {
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      if (exampleHeaders.length === 0) {
        exampleHeaders = cells;
      } else {
        exampleRows.push(cells);
      }
      continue;
    }

    if (/^(Given|When|Then|And|But)\s/.test(line)) {
      if (current) {
        current.steps.push({ action: line });
      }
      continue;
    }
  }

  if (current) {
    flushCurrent();
  }

  function flushCurrent() {
    if (!current) return;
    if (current.type === "outline") {
      scenarioOutlines.push({
        title: current.title,
        steps: current.steps,
        exampleHeaders,
        exampleRows,
      });
    } else {
      scenarios.push({ title: current.title, steps: current.steps });
    }
    current = null;
    inExamples = false;
    exampleHeaders = [];
    exampleRows = [];
  }

  return { title: featureTitle, scenarios, scenarioOutlines };
}

function substituteVariables(
  template: string,
  headers: string[],
  values: string[]
): string {
  let result = template;
  for (let i = 0; i < headers.length; i++) {
    result = result.replace(new RegExp(`<${headers[i]}>`, "g"), values[i]);
  }
  return result;
}

export async function importGherkin(code: string, filePath: string) {
  const content = readFileSync(filePath, "utf-8");
  const feature = parseFeatureFile(content);

  if (!feature.title) {
    throw new Error("Feature title not found in the file");
  }

  const client = new QaseClient();

  // 1. Create suite from Feature name
  console.log(`Creating suite: ${feature.title}`);
  const suiteData = (await client.post(`/suite/${code}`, {
    title: feature.title,
  })) as { result: { id: number } };
  const suiteId = suiteData.result.id;
  console.log(`Suite created with ID: ${suiteId}`);

  let caseCount = 0;

  // 2. Create cases from plain Scenarios
  for (const scenario of feature.scenarios) {
    console.log(`Creating case: ${scenario.title}`);
    await client.post(`/case/${code}`, {
      title: scenario.title,
      suite_id: suiteId,
      steps: scenario.steps,
    });
    caseCount++;
  }

  // 3. Create cases from Scenario Outlines (one per Example row)
  for (const outline of feature.scenarioOutlines) {
    if (outline.exampleRows.length === 0) {
      // No examples — create a single case
      console.log(`Creating case: ${outline.title}`);
      await client.post(`/case/${code}`, {
        title: outline.title,
        suite_id: suiteId,
        steps: outline.steps,
      });
      caseCount++;
    } else {
      for (const row of outline.exampleRows) {
        const title = substituteVariables(
          outline.title,
          outline.exampleHeaders,
          row
        );
        const steps = outline.steps.map((s) => ({
          action: substituteVariables(s.action, outline.exampleHeaders, row),
        }));
        console.log(`Creating case: ${title}`);
        await client.post(`/case/${code}`, {
          title,
          suite_id: suiteId,
          steps,
        });
        caseCount++;
      }
    }
  }

  console.log(
    `\nImport complete: 1 suite and ${caseCount} case(s) created.`
  );
}
