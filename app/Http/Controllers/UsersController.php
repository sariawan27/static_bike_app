<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Redirect;
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
     * @OA\POST(
     *     path="/api/users",
     *     tags={"Users"},
     *     summary="Store user data",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="username", type="string", example="john_doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User stored successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User stored"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation failed"
     *     )
     * )
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|lowercase|max:255|unique:' . User::class,
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => 'required',
        ]);

        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
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
     * @OA\PUT(
     *     path="/api/users/{id}",
     *     tags={"Users"},
     *     summary="Update user data",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password"},
     *             @OA\Property(property="name", type="string", example="John Doe"),
     *             @OA\Property(property="username", type="string", example="john_doe"),
     *             @OA\Property(property="email", type="string", format="email", example="john@example.com"),
     *             @OA\Property(property="password", type="string", format="password", example="secret123")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="User updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User updated"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation failed"
     *     )
     * )
     */
    public function update(Request $request, $id)
    {
        //
        $user = User::find($id);
        $request->validate([
            'name' => 'string|max:255',
            'username' => 'string|lowercase|max:255|unique:users,username,' . $request->id,
            'email' => 'string|lowercase|email|max:255|unique:users,email,' . $request->id,
        ]);

        $data = [
            'name'     => $request->has('name') ? $request->name : $user->name,
            'username'    => $request->has('username') ? $request->username : $user->username,
            'email'    => $request->has('email') ? $request->email : $user->email,
            'password' => $request->has('password') && $request->password != '' && $request->password != 'undefined' && $request->password != null && $request->password != 'null' ? Hash::make($request->password) : $user->password,
        ];

        $user->update($data);

        return response()->json([
            'status' => 200,
            'message' => 'User updated successfully',
            'data' => $user
        ]);
    }

    /**
     * @OA\DELETE(
     *     path="/api/users/{id}",
     *     tags={"Users"},
     *     summary="Delete user data",
     *     @OA\Response(
     *         response=201,
     *         description="Deleted successfully!",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="User updated"),
     *             @OA\Property(property="user", type="object")
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation failed"
     *     )
     * )
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
