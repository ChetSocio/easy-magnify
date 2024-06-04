import { defineConfig } from "tsup"

export default defineConfig({
    clean: true,
    target: "esnext",
    format: ["esm", "cjs"],
    sourcemap: true,
    minify: false,
    splitting: false,
    dts: true,
    treeshake: true,
    entry: [
        "./src/index.ts",
        "!src/stories/**", "!src/**/**/**.md", "!src/components/readme.md",
        "!src/**/**/**.mdx", "!src/**/**.mdx",
        "!src**/*.stories.tsx",
    ],
    external: ["react", "react-dom"],
    globalName: "EasyMagnify",
})