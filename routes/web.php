<?php

use App\Exports\TransactionsExport;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReportingController;
use App\Http\Controllers\TrendingController;
use App\Http\Controllers\UsersController;
use Carbon\Carbon;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\Request;

Route::get('/', function () {
    return redirect('/login');
    // return Inertia::render('Welcome', [
    //     'canLogin' => Route::has('login'),
    //     'canRegister' => Route::has('register'),
    //     'laravelVersion' => Application::VERSION,
    //     'phpVersion' => PHP_VERSION,
    // ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/users', [UsersController::class, 'index'])->name('users.index');
    Route::get('/users/{id}', [UsersController::class, 'show'])->name('users.show');
    Route::post('/users', [UsersController::class, 'store'])->name('users.store');
    Route::put('/users/{id}', [UsersController::class, 'update'])->name('users.update');
    Route::delete('/users/{id}', [UsersController::class, 'destroy'])->name('users.destroy');
});

Route::middleware('auth')->group(function () {
    Route::get('/trending', [TrendingController::class, 'index'])->name('trending.index');
});

Route::middleware('auth')->group(function () {
    Route::get('/reporting', [ReportingController::class, 'index'])->name('reporting.index');
});

Route::get('/export-record', function (Request $req) {

    $name = auth()->user()->name;

    return Excel::download(
        new TransactionsExport($req->all()),
        "record_{$name}.xlsx"
    );
})->name('reporting.export');


require __DIR__ . '/auth.php';
