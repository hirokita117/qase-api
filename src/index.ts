import { getCases } from "./commands/get-cases.js";
import { getCase } from "./commands/get-case.js";
import { getSuites } from "./commands/get-suites.js";
import { createRun } from "./commands/create-run.js";
import { addResult } from "./commands/add-result.js";
import { createSuite } from "./commands/create-suite.js";
import { createCase } from "./commands/create-case.js";
import { importGherkin } from "./commands/import-gherkin.js";

function parseFlag(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

function usage(): never {
  console.log(`Usage: npx tsx src/index.ts <command> <project-code> [options]

Commands:
  get-suites <code>                         List test suites
  get-cases <code>                          List test cases
  get-case  <code> <id>                     Get test case details
  create-run <code> --title <t> [--cases 1,2,3]  Create a test run
  add-result <code> <runId> --case-id <id> --status <status>  Add a test result
  create-suite <code> --title <t> [--parent-id <id>] [--description <d>]  Create a test suite
  create-case <code> --title <t> [--suite-id <id>] [--description <d>]   Create a test case
  import-gherkin <code> --file <path>       Import Gherkin feature file`);
  process.exit(1);
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];
  const code = args[1];

  if (!command || !code) usage();

  switch (command) {
    case "get-suites":
      await getSuites(code);
      break;

    case "get-cases":
      await getCases(code);
      break;

    case "get-case": {
      const id = args[2];
      if (!id) {
        console.error("Error: case id is required");
        usage();
      }
      await getCase(code, id);
      break;
    }

    case "create-run": {
      const title = parseFlag(args, "--title");
      if (!title) {
        console.error("Error: --title is required");
        usage();
      }
      const casesStr = parseFlag(args, "--cases");
      const cases = casesStr
        ? casesStr.split(",").map((s) => parseInt(s, 10))
        : undefined;
      await createRun(code, title, cases);
      break;
    }

    case "add-result": {
      const runId = args[2];
      const caseIdStr = parseFlag(args, "--case-id");
      const status = parseFlag(args, "--status");
      if (!runId || !caseIdStr || !status) {
        console.error("Error: runId, --case-id, and --status are required");
        usage();
      }
      await addResult(code, runId, parseInt(caseIdStr, 10), status);
      break;
    }

    case "create-suite": {
      const title = parseFlag(args, "--title");
      if (!title) {
        console.error("Error: --title is required");
        usage();
      }
      const parentIdStr = parseFlag(args, "--parent-id");
      const parentId = parentIdStr ? parseInt(parentIdStr, 10) : undefined;
      const description = parseFlag(args, "--description");
      await createSuite(code, title, parentId, description);
      break;
    }

    case "create-case": {
      const title = parseFlag(args, "--title");
      if (!title) {
        console.error("Error: --title is required");
        usage();
      }
      const suiteIdStr = parseFlag(args, "--suite-id");
      const suiteId = suiteIdStr ? parseInt(suiteIdStr, 10) : undefined;
      const description = parseFlag(args, "--description");
      await createCase(code, title, suiteId, description);
      break;
    }

    case "import-gherkin": {
      const file = parseFlag(args, "--file");
      if (!file) {
        console.error("Error: --file is required");
        usage();
      }
      await importGherkin(code, file);
      break;
    }

    default:
      console.error(`Unknown command: ${command}`);
      usage();
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
