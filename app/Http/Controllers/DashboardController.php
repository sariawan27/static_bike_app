<?php

namespace App\Http\Controllers;

use App\Models\HistoryRecord;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // $hrcId = $request->input('hrc_id');

        // STEP 1 — Hitung total_energy & durasi per history (FIXED GROUP BY)
        $sessionQuery = DB::table('history_records as h')
            ->join('transactions as t', 't.hrc_id', '=', 'h.id')
            ->select(
                'h.id as history_id',
                'h.user_id',
                'h.start',
                'h.end',
                DB::raw('SUM(t.energy) as total_energy'),
                DB::raw('TIMESTAMPDIFF(SECOND, h.start, h.end) as duration')
            )
            ->groupBy('h.id', 'h.user_id', 'h.start', 'h.end');   // <-- FIX

        // STEP 2 — Ranking per user
        $best = DB::table(DB::raw("({$sessionQuery->toSql()}) as s"))
            ->mergeBindings($sessionQuery)
            ->select(
                's.history_id',
                's.user_id',
                's.total_energy',
                's.duration'
            )
            ->selectRaw("
            ROW_NUMBER() OVER (
                PARTITION BY s.user_id 
                ORDER BY s.total_energy DESC, s.duration ASC
            ) as rank_session
        ");

        // STEP 3 — Ambil satu history terbaik per user
        $ranking = DB::table(DB::raw("({$best->toSql()}) as b"))
            ->mergeBindings($best)
            ->join('users as u', 'u.id', '=', 'b.user_id')
            ->where('b.rank_session', 1)
            ->orderByDesc('b.total_energy')
            ->orderBy('b.duration')
            ->get([
                'u.id as user_id',
                'u.name',
                'b.history_id',
                'b.total_energy',
                'b.duration'
            ]);


        // if ($hrcId == null) {
        //     // $hrc
        //     if (!$hrcData->isEmpty()) {
        //         $trxData = Transaction::where('user_id', Auth::id())->where('hrc_id', $hrcData[0]->id)
        //             ->orderBy('created_at', 'asc')
        //             ->get();
        //     } else {
        //         $trxData = [];
        //     }
        // } else {
        //     $trxData = Transaction::where('user_id', Auth::id())->when($hrcId, fn($q) => $q->where('hrc_id', $hrcId))
        //         ->orderBy('created_at', 'asc')
        //         ->get();
        // }

        $dashboardData = [
            'ranking' => $ranking,
            // 'trxData' => $trxData,
            // 'hrcData' => $hrcData,
            // 'filter'  => $hrcId,
        ];

        // var_dump($trendingData);
        // die();
        return Inertia::render('Dashboard', $dashboardData);
    }
}
