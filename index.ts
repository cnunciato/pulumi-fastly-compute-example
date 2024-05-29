import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import * as fastly from "@pulumi/fastly";
import * as childProcess from "child_process";
import * as path from "path";

// Location of Fastly app source.
const appPath = "./app";

// Location of the built app package.
const packagePath = path.join(appPath, "pkg", "app.tar.gz");

// Generate a random subdomain (using a Pulumi RandomString: https://www.pulumi.com/registry/packages/random/api-docs/randomstring/).
const subdomain = new random.RandomString("subdomain", { length: 12, special: false, upper: false }).result;

// Install app dependencies and run a build using the Fastly CLI.
const result = childProcess.execSync("npm install && fastly compute build", { stdio: "pipe", cwd: appPath });

// Provision a service with a randomly-generated hostname.
const service = new fastly.ServiceCompute("my-service", {
    domains: [{
        name: pulumi.interpolate`${subdomain}.edgecompute.app`,
    }],
    package: {
        filename: packagePath,
    },
    forceDestroy: true,
});

// Export the service URL.
export const serviceURL = service.domains.apply(domains => pulumi.interpolate`https://${domains[0].name}`);

// The Fastly API will return successfully before the Compute service is
// actually up and running. This means your users could see 500 or 503 errors
// for several seconds while the service starts up. To prevent this, you can
// have Pulumi ping the service URL for an acceptable HTTP status code and
// content before exiting, using fetch and a standard JavaScript interval.
//
// Since we only want this post-deployment check to run on updates, we can use
// pulumi.runtime.isDryRun() to skip it for previews.
if (!pulumi.runtime.isDryRun()) {
    serviceURL.apply(url => {
        pulumi.log.info("Awaiting service availability...", service);

        const interval = setInterval(async () => {
            const result = await fetch(url);
            const body = await result.text();

            if (result.status === 200 && body.match(/Welcome/)) {
                clearInterval(interval);
            }
        }, 2000);
    });
}
