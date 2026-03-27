import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

// Script-style TS files that are loaded individually (no import/export)
// All former script-style files have been migrated into the app.ts bundle.
const scriptEntryPoints = [
];

// Module bundle: main.ts and all its imports bundled into one file
const bundleConfig = {
    entryPoints: ['scripts/app.ts'],
    bundle: true,
    outfile: 'dist/app.js',
    format: 'iife',
    target: 'es2024',
    sourcemap: true,
    platform: 'browser',
    logLevel: 'info',
};

// Script-style files: just strip types, no bundling, no wrapping
const scriptConfig = {
    entryPoints: scriptEntryPoints,
    bundle: false,
    outdir: 'dist',
    target: 'es2024',
    sourcemap: true,
    platform: 'browser',
    logLevel: 'info',
};

if (isWatch) {
    const bundleCtx = await esbuild.context(bundleConfig);
    const scriptCtx = await esbuild.context(scriptConfig);
    await Promise.all([bundleCtx.watch(), scriptCtx.watch()]);
    console.log('Watching for changes...');
} else {
    await Promise.all([
        esbuild.build(bundleConfig),
        esbuild.build(scriptConfig),
    ]);
}
