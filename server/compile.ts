const { compile } = require("nexe");

const NODE_VERSION = "12.3.1";
const targets = [
  {
    platform: "Windows",
    binaryName: "artt",
    os: "win32",
    arch: "x64",
  },
  {
    platform: "Mac (Intel)",
    binaryName: "artt",
    os: "darwin",
    arch: "x64",
  },
  {
    platform: "Mac (M1)",
    binaryName: "artt-m1",
    os: "darwin",
    arch: "arm64",
  },
];

targets.reduce((acc, target) => {
  return acc
    .then(() => {
      return compile({
        name: "Analytics Runtime Testing Tool",
        input: "./dist/server.js",
        output: `bin/${target.binaryName}`,
        target: `${target.os}-${target.arch}-${NODE_VERSION}`,
        resources: ["public/**/*.*", ".env"],
        build: true,
        verbose: true,
        configure: ["--openssl-no-asm"]
      });
    })
    .then(() => {
      // eslint-disable-next-line
      console.log("success:", target.platform);
    });
}, Promise.resolve());
