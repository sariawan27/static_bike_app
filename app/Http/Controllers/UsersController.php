<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Inertia\Inertia;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = User::all();

        return Inertia::render('User/ListPage', [
            'users' => $user,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => 'required',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'User created successfully',
            'data' => $user
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
        $user = User::find($id);

        return response()->json([
            'status' => 200,
            'message' => 'User retrieved successfully',
            'user' => $user 
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
        // return Inertia::render('Profile/Edit', [
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
        $user = User::find($id);
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'string|lowercase|email|max:255|unique:'.User::class,
        ]);

        $data = [
            'name'     => $request->has('name') ? $request->name : $user->name,
            'email'    => $request->has('email') ? $request->email : $user->email,
            'password' => $request->has('password') ? Hash::make($request->password) : $user->password,
        ];
        
        $user->update($data);

        return response()->json([
            'status' => 200,
            'message' => 'User updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
        $user = User::find($id);

        $user->delete($id);

        return response()->json([
            'status' => 204,
            'message' => 'Deleted successfully!'
        ]);
    }
}
