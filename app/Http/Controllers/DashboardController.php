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

        // STEP 1 — Hitung total_energy & durasi per history terlebih dahulu
        $sessionTotals = DB::table('history_records as h')
            ->join('transactions as t', 't.hrc_id', '=', 'h.id')
            ->select(
                'h.id as history_id',
                'h.user_id',
                DB::raw('SUM(t.energy) as total_energy'),
                DB::raw('TIMESTAMPDIFF(SECOND, h.start, h.end) as duration')
            )
            ->groupBy('h.id', 'h.user_id', 'h.start', 'h.end');

        // STEP 2 — Jumlahkan semua history per user (jumlahkan total_energy & duration per history)
        $userTotals = DB::table(DB::raw("({$sessionTotals->toSql()}) as s"))
            ->mergeBindings($sessionTotals)
            ->select(
                's.user_id',
                DB::raw('SUM(s.total_energy) as total_energy'),
                DB::raw('SUM(s.duration) as total_duration')
            )
            ->groupBy('s.user_id');

        // STEP 3 — Ambil ranking berdasarkan total_energy (semua sesi digabung per user)
        $ranking = DB::table(DB::raw("({$userTotals->toSql()}) as u"))
            ->mergeBindings($userTotals)
            ->join('users as users', 'users.id', '=', 'u.user_id')
            ->orderByDesc('u.total_energy')
            ->get([
                'users.id as user_id',
                'users.name',
                DB::raw('u.total_energy'),
                DB::raw('u.total_duration as duration')
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
