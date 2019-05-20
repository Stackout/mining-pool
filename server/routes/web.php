<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::get('/{path?}', 'Home@index')->name('home');

// Manage Routes
Route::get('/manage/{path?}', 'Home@index')->name('manage');
Route::get('/manage/{path?}/create', 'Home@index')->name('manage.resources.create');
Route::get('/manage/{path?}/{id}', 'Home@index')->name('manage.resources.edit');

// Account Routes
Route::get('/account/{path?}', 'Home@index')->name('accounts.index');
Route::get('/account/settings/{path?}', 'Home@index')->name('accounts.settings');

Auth::routes(['verify' => true]);

Route::get('/password/reset/{token}', 'Home@index')->name('password.reset');

