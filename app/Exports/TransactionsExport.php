<?php

namespace App\Exports;

use App\Models\HistoryRecord;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TransactionsExport implements FromCollection, WithHeadings, WithStyles, WithColumnWidths
{
    protected $payload;

    public function __construct($payload)
    {
        $this->payload = $payload;
    }

    public function headings(): array
    {
        return [
            ['Data Record'], // Judul besar (row 1)
            ['Speed', 'Voltage', 'Current', 'Power', 'Energy', 'Timestamp'] // Header tabel (row 2)
        ];
    }

    public function collection()
    {
        $hrcId = $this->payload['hrc_id'];

        $hrcData = HistoryRecord::where('user_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->get();

        if ($hrcId == null) {
            // $hrc
            if (!$hrcData->isEmpty()) {
                $query = Transaction::query()->select('rpm', 'voltage', 'current', 'power', 'energy', 'created_at');

                // ambil user_id dari user login
                $query->where('user_id', Auth::id())->where('hrc_id', $hrcData[0]->id);

                $trxData = $query->orderBy('created_at', 'desc')
                    ->get();
            } else {
                $trxData = [];
            }
        } else {
            $query = Transaction::query()->select('rpm', 'voltage', 'current', 'power', 'energy', 'created_at');

            // ambil user_id dari user login
            $query->where('user_id', Auth::id())->when($hrcId, fn($q) => $q->where('hrc_id', $hrcId));

            $trxData = $query->orderBy('created_at', 'desc')
                ->get();
        }

        return $trxData;
    }

    public function columnWidths(): array
    {
        return [
            'A' => 20,
            'B' => 20,
            'C' => 20,
            'D' => 20,
            'E' => 20,
            'F' => 30,
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // Merge cell untuk judul
        $sheet->mergeCells('A1:F1');

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
        $sheet->getStyle('A2:F2')->applyFromArray([
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
        $sheet->getStyle("A2:F$lastRow")->applyFromArray([
            'borders' => [
                'allBorders' => [
                    'borderStyle' => 'thin',
                ]
            ]
        ]);
    }
}
