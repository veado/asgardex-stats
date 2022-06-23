# ASGARDEX stats

_Statistics of [ASGARDEX desktop releases](https://github.com/thorchain/asgardex-electron/releases)_

**LIVE** :eyes: https://veado.github.io/asgardex-stats/

![Preview](./preview.gif)

### Where does the data come from?

All data are consumed from GitHub API https://docs.github.com/rest

## ENV

Copy [env.sample](env.sample) and rename to `.env`. Add your personal GitHub token (see [Creating a personal token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)) to `VITE_GH_TOKEN`
to extend [rate limits](https://docs.github.com/en/rest/rate-limit) of GitHub's [REST API](https://docs.github.com/en/rest).

```
# Replace {github-token} with your personal GitHub token
VITE_GH_TOKEN={github-token}
```

### Local development

```bash
# install dependencies (only once needed)
npm i
# run app locally at http://localhost:3000/asgardex-stats/
npm run dev
```

## Built with (in alphabetical order)

- [fp-ts](https://gcanti.github.io/fp-ts/)
- [Frappe charts](https://frappe.io/charts) / [svelte-frappe-charts](https://github.com/himynameisdave/svelte-frappe-charts)
- [Grid.js](https://gridjs.io) / [gridjs-svelte](https://github.com/iamyuu/gridjs-svelte)
- [RxJS](https://rxjs.dev)
- [Svelte](https://svelte.dev)
- [tailwindcss](https://tailwindcss.com)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## Licence

[MIT](./LICENSE)
