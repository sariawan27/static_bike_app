<?php

namespace App\Exports;

use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromCollection;

use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class RankingExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    protected $payload;

    public function __construct($payload)
    {
        $this->payload = $payload;
    }

    public function headings(): array
    {
        return [
            ['Ranking Data Record'], // Judul besar (row 1)
            ['Name', 'Energy Produced (Wh)', 'Calory (kcal)', 'Duration'] // Header tabel (row 2)
        ];
    }
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
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
                'users.name',
                DB::raw('u.total_energy'),
                DB::raw('u.total_energy'),
                DB::raw('(u.total_energy * 0.8604) as calory'),
                DB::raw('u.total_duration as duration')
            ]);

        return $ranking;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 35,
            'B' => 25,
            'C' => 25,
            'D' => 25,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Merge cell untuk judul
        $sheet->mergeCells('A1:D1');

        // Style judul
        $sheet->getStyle('A1')->applyFromArray([
            'font' => [
                'bold' => true,
                'size' => 16,
            ],
            'alignment' => [
                'horizontal' => 'center',
            ],
        ]);

        // Style header tabel
        $sheet->getStyle('A2:D2')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF']
            ],
            'fill' => [
                'fillType' => 'solid',
                'color' => ['rgb' => '4388F8']
            ]
        ]);

        // Beri border semua tabel
        $lastRow = $sheet->getHighestRow();
        $sheet->getStyle("A2:D$lastRow")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                ]
            ]
        ]);
    }
}
