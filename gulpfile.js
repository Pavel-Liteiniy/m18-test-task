const { src, dest, parallel, series, watch } = require( 'gulp' );
const browserSync = require( 'browser-sync' ).create();
const sourcemaps = require( 'gulp-sourcemaps' );
const babel = require( 'gulp-babel' );
const concat = require( 'gulp-concat' );
const uglify = require( 'gulp-uglify' );
const plumber = require( 'gulp-plumber' );
const rename = require( 'gulp-rename' );
const less = require( 'gulp-less' );
const postcss = require( 'gulp-postcss' );
const autoprefixer = require( 'autoprefixer' );
const csso = require( 'gulp-csso' );
const imagemin = require( 'gulp-imagemin' );
const webp = require( 'gulp-webp' );
const svgstore = require( 'gulp-svgstore' );
const htmlmin = require( 'gulp-htmlmin' );
const del = require( 'del' );

function sync() {
	browserSync.init( {
		server: {
			baseDir: './docs/',
		},
		notify: false,
		online: true,
		open: true,
		cors: true,
		ui: false,
	} );

	watch( './src/*.html', series( html ) ).on( 'change', browserSync.reload );
	watch( './src/less/**/*.less', series( les ) );
	watch( './src/css/**/*.css', series( css ) );
	watch( './src/js/**/*.js', series( js ) ).on( 'change', browserSync.reload );
}

function js() {
	return src( './src/js/**/*.js' )
		.pipe( sourcemaps.init() )
		.pipe(
			babel( {
				presets: [ '@babel/env' ],
				plugins: [ '@babel/plugin-proposal-class-properties' ]
			} )
		)
		.pipe( uglify() )
		.pipe( concat( 'script.min.js' ) )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( dest( './docs/js/' ) );
}

function les() {
	return src( './src/less/style.less' )
		.pipe( plumber() )
		.pipe( sourcemaps.init() )
		.pipe( less() )
		.pipe( postcss( [ autoprefixer() ] ) )
		.pipe( csso() )
		.pipe( rename( 'style.min.css' ) )
		.pipe( sourcemaps.write( '.' ) )
		.pipe( dest( './docs/css' ) )
		.pipe( browserSync.stream() );
}

function css() {
	return src( './src/css/vendor/*.css' )
		.pipe( postcss( [ autoprefixer() ] ) )
		.pipe( csso() )
		.pipe(
			rename( {
				suffix: '.min',
			} )
		)
		.pipe( dest( './docs/css/vendor' ) );
}

function convertWebp() {
	return src( './src/img/**/*.{png,jpg}' )
		.pipe( webp( { quality: 90 } ) )
		.pipe( dest( './src/img' ) );
}

function sprite() {
	return src( './src/img/**/icon-*.svg' )
		.pipe( svgstore( { inlineSvg: true } ) )
		.pipe( rename( 'sprite.svg' ) )
		.pipe( dest( './docs/img' ) );
}

function html() {
	return src( './src/*.html' )
		.pipe( htmlmin( { collapseWhitespace: true, removeComments: true } ) )
		.pipe( dest( './docs/' ) );
}

function img() {
	return src( './src/img/**/*.{png,jpg,svg}' )
		.pipe(
			imagemin( [
				imagemin.optipng( { optimizationLevel: 3 } ),
				imagemin.mozjpeg( { quality: 80, progressive: true } ),
				imagemin.svgo(),
			] )
		)
		.pipe( dest( './src/img' ) );
}

function copy() {
	return src(
		[
			'./src/fonts/**/*.{woff,woff2}',
			'./src/img/*',
			'!./src/img/icon'
		],
		{
			base: './src/',
		},
	)
		.pipe( dest( './docs/' ) )
		.pipe( src(
			'./*.{png,ico,svg,xml,webmanifest}',
			{
				base: './'
			}
		) )
		.pipe( dest( './docs/' ) );
}

function clear() {
	return del( './docs' );
}

exports.docs = series(
	parallel( clear, convertWebp, img ),
	parallel( sprite, html, copy, les, js, css )
);
exports.start = series( exports.docs, sync );
