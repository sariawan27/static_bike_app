<?php

namespace App\Http\Controllers;

use App\Models\HistoryRecord;
use App\Models\Log;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReportingController extends Controller
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
            if (!$hrcData->isEmpty()) {
                $query = Transaction::query();

                // ambil user_id dari user login
                $query->where('user_id', Auth::id())->where('hrc_id', $hrcData[0]->id);

                // filter tanggal
                if ($request->filled('startdate') && $request->filled('enddate')) {
                    $query->whereBetween('created_at', [$request->startdate, $request->enddate]);
                }

                $trxData = $query->orderBy('created_at', 'desc')
                    ->paginate(10)
                    ->withQueryString();
            } else {
                $trxData = [];
            }
        } else {
            $query = Transaction::query();

            // ambil user_id dari user login
            $query->where('user_id', Auth::id())->when($hrcId, fn($q) => $q->where('hrc_id', $hrcId));

            // filter tanggal
            if ($request->filled('startdate') && $request->filled('enddate')) {
                $query->whereBetween('created_at', [$request->startdate, $request->enddate]);
            }

            $trxData = $query->orderBy('created_at', 'desc')
                ->paginate(10)
                ->withQueryString();
        }

        $reportingData = [
            'trxData' => $trxData,
            'hrcData' => $hrcData,
            'filter'  => $hrcId,
        ];

        return Inertia::render('Reporting/index', $reportingData);
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
