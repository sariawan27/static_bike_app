<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Log;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        // dd(
        //     request()->header('X-Inertia'),
        //     request()->expectsJson()
        // );

        // $request->validate([
        //     'name' => 'required|string|max:255',
        //     'username' => 'required|string|max:100|unique:' . User::class,
        //     'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
        //     'password' => ['required', 'confirmed', Rules\Password::defaults()],
        // ]);


        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:100|unique:' . User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ], [
            // Username
            'username.required' => 'Username wajib diisi.',
            'username.string'   => 'Username harus berupa teks.',
            'username.max'      => 'Username maksimal 100 karakter.',
            'username.unique'   => 'Username sudah digunakan.',

            // Email
            'email.required'  => 'Email wajib diisi.',
            'email.string'    => 'Email harus berupa teks.',
            'email.email'     => 'Format email tidak valid.',
            'email.max'       => 'Email maksimal 255 karakter.',
            'email.unique'    => 'Email sudah terdaftar.',

            // Password
            'password.required'   => 'Password wajib diisi.',
            'password.confirmed'  => 'Konfirmasi password tidak cocok.',
        ]);

        if ($validator->fails()) {
            return Inertia::render('Auth/Register', [
                'errors' => $validator->errors()->toArray(),
            ])->toResponse($request)->setStatusCode(422);
        }

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Simpan ke logs
        Log::create([
            'user_id' => Auth::id()
        ]);

        return redirect(route('dashboard', absolute: false));
    }
}
