import { Octokit } from "@octokit/rest";

const owner = process.env.GITHUB_OWNER || "";
const repo = process.env.GITHUB_REPO || "";
const branch = process.env.GITHUB_BRANCH || "main";
const token = process.env.GITHUB_TOKEN || "";

function getOcto() {
  if (!token || !owner || !repo) {
    throw new Error("Missing GitHub environment variables.");
  }
  return new Octokit({ auth: token });
}

async function getSha(octo, path) {
  try {
    const { data } = await octo.repos.getContent({ owner, repo, path, ref: branch });
    return data?.sha;
  } catch {
    return undefined;
  }
}

export async function writeFile(path, content, message) {
  const octo = getOcto();
  const sha = await getSha(octo, path);
  const encoded = Buffer.from(content, "utf8").toString("base64");

  const { data } = await octo.repos.createOrUpdateFileContents({
    owner, repo, path, message, content: encoded, branch, sha
  });
  return { path: data?.content?.path, commit: data?.commit?.sha };
}

export async function updateProjectsIndex(path) {
  const octo = getOcto();
  const indexPath = "data/projects.json";
  let arr = [];
  try {
    const { data } = await octo.repos.getContent({ owner, repo, path: indexPath, ref: branch });
    const buf = Buffer.from(data.content, "base64").toString("utf8");
    arr = JSON.parse(buf);
  } catch {
    arr = [];
  }

  const slug = path.replace(/^projects\//, "").replace(/\.md$/, "");
  if (!arr.find((x) => x.slug === slug)) {
    arr.unshift({ slug, path });
  }
  const encoded = Buffer.from(JSON.stringify(arr, null, 2), "utf8").toString("base64");
  await octo.repos.createOrUpdateFileContents({
    owner, repo, path: indexPath, message: "NovaForge: update projects index", content: encoded, branch
  });
}
