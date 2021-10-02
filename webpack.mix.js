const mix = require('laravel-mix');


/*
mix.browserSync({
    host: 'localhost',
    proxy: 'app',
    port: '3000',
    open: false
});
*/

mix.ts('resources/js/app.tsx', 'public/js')
    .react()
    .sass('resources/scss/app.scss', 'public/css', [
        //
    ]);
