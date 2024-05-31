# pulumi-fastly-compute-example

An example of using [Pulumi](https://www.pulumi.com/) with TypeScript to provision a simple [Fastly Compute](https://www.fastly.com/documentation/guides/compute/) service.

## Prerequisites

* [Node.js](https://nodejs.org/en/download/package-manager)
* [Pulumi](https://www.pulumi.com/docs/install/)
* [The Fastly CLI](https://www.fastly.com/documentation/reference/tools/cli/)
* [A Fastly API token](https://docs.fastly.com/en/guides/using-api-tokens#creating-api-tokens)

## What's in the repo?

At the root of the repo is the Pulumi project. It's a [Node.js/TypeScript project](https://www.pulumi.com/docs/languages-sdks/javascript/) that builds the Fastly app (with the Fastly CLI) and deploys the packaged application to Fastly as a Compute service. See `index.ts` for details.

The `app` folder contains the Fastly Compute application. It's a JavaScript application that was created with the Fastly CLI using the walkthrough at https://www.fastly.com/documentation/guides/compute.

## How to use it

First, make sure you've exported your [Fastly API token](https://docs.fastly.com/en/guides/using-api-tokens#creating-api-tokens) as an environment variable:

```bash
export FASTLY_API_KEY="<your-api-key>"
```

Then, install dependencies:

```bash
npm install
```

Create a new Pulumi stack:

```bash
pulumi stack init dev
```

Then finally, build the Fastly app and deploy!

```bash
pulumi up
```

In a few seconds, the service should be up and running (it sometimes takes Fastly a minute or so to spin things up):

```bash
curl -I $(pulumi stack output serviceURL)

HTTP/2 200
content-type: text/html; charset=utf-8
x-served-by: cache-bfi-kbfi7400086-BFI
date: Thu, 30 May 2024 18:31:02 GMT
```

## Cleaning up

To destroy all deployed infrastructure:

```bash
pulumi destroy --remove
```

## Deploying as a Pulumi template

You can also deploy this project as a Pulumi template -- either with `pulumi new` (following the prompts):

```bash
pulumi new https://github.com/cnunciato/pulumi-fastly-compute-example
```

... or with [Pulumi Deployments](https://www.pulumi.com/docs/pulumi-cloud/deployments/), which will provision a GitHub repository automatically and configure it for PR previews and automated deployments:

[![Deploy with Pulumi](https://get.pulumi.com/new/button.svg)](https://app.pulumi.com/new?template=https://github.com/cnunciato/pulumi-fastly-compute-example)

For the latter, you'll need to install the Fastly CLI. (The initial deployment will fail on the absence of the `fastly` CLI command.) To do so, add the following line to your Pre-Run Commands (at Settings > Deploy in Pulumi Cloud), passing the version of the CLI that you want to install:

```bash
./install-fastly-cli.sh v10.10.0
```

Once configured, any pushes to your GitHub repository will trigger a rebuild deployment of the Fastly app.

## Learn more

* [Pulumi documentation](https://www.pulumi.com/docs/)
* [Fastly provider documentation in the Pulumi Registry](https://www.pulumi.com/registry/packages/fastly/)
* [Fastly Compute documentation](https://docs.fastly.com/products/compute)
