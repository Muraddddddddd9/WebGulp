// Подключение Glup
const gulp = require('gulp');
const fileInclude = require('gulp-file-include');

// SASS
const sass = require('gulp-sass')(require('sass'));
const sassGlob = require('gulp-sass-glob');
const autoprefixer = require ('gulp-autoprefixer')


const server = require('gulp-server-livereload');
const clean = require('gulp-clean');
const fs = require('fs');
const sourceMaps = require('gulp-sourcemaps');
const plumber = require ('gulp-plumber');
const notify = require ('gulp-notify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const changed = require('gulp-changed');


const webpack = require ('webpack-stream');
// Подключение Glup


gulp.task('clean:dev', function (done) {
	if (fs.existsSync('./build/')) { /*Проверка есть ли папка или нет*/
		return gulp
			.src('./build/', { read: false })
			.pipe(clean({ force: true }));
	}
	done();/*Благодаря этому не выдает ошибку*/
});

const fileIncludeSetting = {
	prefix: '@@',
	basepath: '@file',
};/*Это к Gulp(y) 'html'*/

const plumberNotify = (title) => {
	return {
		errorHandler: notify.onError({
			title: title,
			message: 'Error <%= error.message %>',
			sound: false,
		}),
	};
}; 

gulp.task('html:dev'/* <---Это Имя */, function () {
	return (
		gulp
			.src(['./src/html/**/*.html', '!./src/html/blocks/*.html']) // Сыллка откуда берём инфу и '!' это значит что мы не берем эту папку или файл
			.pipe(changed('./build/', { hasChanged: changed.compareContents }))
			.pipe(plumber(plumberNotify('HTML')))
			.pipe(fileInclude(fileIncludeSetting))// Закидываем в NPM 
			.pipe(gulp.dest('./build/'))//Сохраняем это в папке ''build''
	);
});

gulp.task('sass:dev'/* <---Это Имя */, function () {
	return (
		gulp
			.src('./src/scss/*.scss')// Сыллка откуда берём инфу
			.pipe(changed('./build/css/'))
			.pipe(plumber(plumberNotify('SCSS')))
			.pipe(sourceMaps.init())/* В каком CSS фыйле находиться этот стиль ищет (результат в просмотре кода на странице) */
			.pipe(sassGlob())
			.pipe(sass())// Закидываем в NPM
			.pipe(sourceMaps.write())/* В каком CSS фыйле находиться этот стиль ищет (результат в просмотре кода на странице) */
			.pipe(gulp.dest('./build/css/'))//Сохраняем это в папке ''CSS'' которая находиться в папке''build''
	);
});


gulp.task('images:dev', function () {
	return gulp
		.src('./src/img/**/*')
		.pipe(changed('./build/img/'))
		// .pipe(imagemin({ verbose: true }))
		.pipe(gulp.dest('./build/img/'));
});


gulp.task('fonts:dev', function () {
	return gulp
		.src('./src/fonts/**/*')
		.pipe(changed('./build/fonts/'))
		.pipe(gulp.dest('./build/fonts/'));
});

gulp.task('files:dev', function () {
	return gulp
		.src('./src/files/**/*')
		.pipe(changed('./build/files/'))
		.pipe(gulp.dest('./build/files/'));
});

gulp.task('js:dev', function () {
	return gulp
		.src('./src/js/*.js')
		.pipe(changed('./build/js/'))
		.pipe(plumber(plumberNotify('JS')))
		// .pipe(babel())
		.pipe(webpack(require('./../webpack.config.js')))
		.pipe(gulp.dest('./build/js/'));
});

const serverOptions = {
    livereload: true,
    open: true
} /*Это к Gulp(y) 'server'*/

gulp.task('server:dev', function () {
	return gulp.src('./build/').pipe(server(serverOptions));
});

gulp.task('watch:dev', function () {
	gulp.watch('./src/scss/**/*.scss', gulp.parallel('sass:dev'));
	gulp.watch('./src/html/**/*.html', gulp.parallel('html:dev'));
	gulp.watch('./src/img/**/*', gulp.parallel('images:dev'));
	gulp.watch('./src/fonts/**/*', gulp.parallel('fonts:dev'));
	gulp.watch('./src/files/**/*', gulp.parallel('files:dev'));
	gulp.watch('./src/js/**/*.js', gulp.parallel('js:dev'));
});

