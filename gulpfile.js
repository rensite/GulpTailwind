const   gulp            = require('gulp'),
        sass            = require('gulp-sass'),
        postcss         = require('gulp-postcss'),
        browserSync     = require('browser-sync').create(),
        del             = require('del'),
        concat          = require('gulp-concat'),
        nunjucks        = require('gulp-nunjucks'),
        autoprefixer    = require('autoprefixer'),
        tailwindcss     = require('tailwindcss'),
        inject          = require('gulp-inject-string');

const   buildHash = Math.random().toString().split(".")[1];
const   tailwindConfig = './tailwind.config.js';
const   outputDir = 'build';
const   inputDir = 'src';

function watch () {
    browserSync.init({
        watch: true,
        server: {
            baseDir: outputDir
        }
    })
    gulp.watch(`${inputDir}/js/**/*.js`, js);
    gulp.watch(`${inputDir}/scss/**/*.scss`, scss);
    gulp.watch(`${inputDir}/pages/**/*.njk`, pages);
    gulp.watch(`${inputDir}/**/*`).on('change', browserSync.reload);
}

function scss () {
    return gulp.src([`${inputDir}/scss/**/*.scss`, `!${inputDir}/scss/**/_*.scss`])
        .pipe(sass())
        .pipe(postcss([
            tailwindcss(tailwindConfig),
            autoprefixer,
        ]))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(`${outputDir}/css`))
}

function js () {
    return gulp.src(`${inputDir}/js/**/*`)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(`${outputDir}/js`));
}

function assets () {
    return gulp.src(`${inputDir}/assets/**/*`)
        .pipe(gulp.dest(`${outputDir}/assets`));
}

function pages () {
    return gulp.src([`${inputDir}/pages/**/*.njk`, `!${inputDir}/pages/**/_*.njk`])
        .pipe(nunjucks.compile())
        .pipe(inject.replace('%build-hash%', buildHash))
        .pipe(gulp.dest(outputDir));
}

function clean () {
    return del(outputDir, {force: true});
}

gulp.task('watch', gulp.series(watch));
gulp.task('build', gulp.series(clean, scss, js, assets, pages));