const { compile } = require("nexe");

const NODE_VERSION = "12.3.1";
const targets = [
  {
    platform: "Mac (Intel)",
    binaryName: "bongranelapp",
    os: "darwin",
    arch: "x64",
  },
  {
    platform: "Linux",
    binaryName: "bongranelapp",
    os: "linux",
    arch: "x64",
  },
];

targets.reduce((acc, target) => {
  return acc
    .then(() => {
      return compile({
        name: "BonGranelApp",
        input: "./dist/index.js",
        output: `bin/${target.os}/${target.binaryName}`,
        target: `${target.os}-${target.arch}-${NODE_VERSION}`,
        resources: ["public/**/*.*"],
        build: true,
        verbose: true,
        // configure: ["--openssl-no-asm"],
      });
    })
    .then(() => {
      // eslint-disable-next-line
      console.log("success:", target.platform);
    });
}, Promise.resolve());
