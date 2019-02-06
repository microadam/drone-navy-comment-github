const createOctokit = require('@octokit/rest')

const ghToken = process.env.GITHUB_TOKEN
const botName = process.env.PLUGIN_BOTNAME
const version = process.env.DRONE_TAG
const branch = process.env.DRONE_BRANCH
const repoOwner = process.env.DRONE_REPO_OWNER
const repoName = process.env.DRONE_REPO_NAME
const repoHead = `${repoOwner}:${branch}`

if (!botName || !ghToken) {
  console.log('BOTNAME and GITHUB_TOKEN must be set')
  process.exit(1)
}

const environment = version.includes('-') ? 'staging' : 'production'
const octokit = createOctokit()

octokit.authenticate({
  type: 'token',
  token: ghToken
})

const prOptions = { owner: repoOwner, repo: repoName, head: repoHead }
octokit.pullRequests.getAll(prOptions, (error, result) => {
  if (error) {
    console.log(error)
    process.exit(1)
  }
  const prNumber = result.data[0].number
  const body = `@${botName} on ${environment}`
  const commentOptions = { owner: repoOwner, repo: repoName, number: prNumber, body }
  octokit.issues.createComment(commentOptions, (error, result) => {
    if (error) {
      console.log(error)
      process.exit(1)
    }
  })
})



