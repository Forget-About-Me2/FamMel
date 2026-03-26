import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');

// Script-style TS files that are loaded individually (no import/export)
const scriptEntryPoints = [
    'scripts/quotes.ts',
    'scripts/debugMenu.ts',
    'scripts/backPackItems.ts',
    'scripts/store.ts',
    'scripts/bladder.ts',
    'scripts/yourbladder.ts',
    'scripts/actions.ts',
    'scripts/clothes.ts',
    'scripts/drive.ts',
    'scripts/herhome.ts',
    'scripts/locations.ts',
    'scripts/locations/driveAround.ts',
    'scripts/locations/theBar.ts',
    'scripts/locations/theClub.ts',
    'scripts/locations/theatre.ts',
    'scripts/locations/theMakeOut.ts',
    'scripts/fuckHer.ts',
    'scripts/images.ts',
    'scripts/pop-up.ts',
    'scripts/settings.ts',
    'scripts/validation.ts',
    'scripts/games/darts.ts',
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
