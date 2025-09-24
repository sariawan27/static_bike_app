<?php

namespace App\Http\Controllers;

use App\Models\HistoryRecord;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TrendingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $hrcId = $request->input('hrc_id');

        $hrcData = HistoryRecord::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        if ($hrcId == null) {
            // $hrc
            $trxData = Transaction::where('user_id', Auth::id())->where('hrc_id', $hrcData[0]->id)
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $trxData = Transaction::where('user_id', Auth::id())->when($hrcId, fn($q) => $q->where('hrc_id', $hrcId))
                ->orderBy('created_at', 'desc')
                ->get();
        }

        $trendingData = [
            'trxData' => $trxData,
            'hrcData' => $hrcData,
            'filter'  => $hrcId,
        ];

        // var_dump($trendingData);
        // die();
        return Inertia::render('Trending/index', $trendingData);
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
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
