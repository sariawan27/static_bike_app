<?php

namespace App\Imports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\WithValidation; // Tambahkan ini
use Maatwebsite\Excel\Concerns\SkipsOnFailure; // Tambahkan ini agar tidak berhenti saat error
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Maatwebsite\Excel\Validators\Failure;

class UsersImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure, WithChunkReading
{
    /**
     * @param array $row
     *
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $fullName = trim($row['nama']);
        $username = $this->generateUsername($fullName);

        return new User([
            'name'      => $fullName,
            'username'  => $username,
            'email'     => $row['email'],
            'password'  => Hash::make($row['pasword']), // Asumsi header excel 'pasword'
            'role'      => 0, // Default value sesuai gambar
        ]);
    }

    public function chunkSize(): int
    {
        return 100;
    }

    /**
     * Tentukan baris mana yang menjadi header
     */
    public function headingRow(): int
    {
        return 3; // Beritahu Laravel bahwa header ada di baris ke-3
    }

    /**
     * Aturan validasi untuk setiap baris
     */
    public function rules(): array
    {
        return [
            'email' => [
                'email',
                'unique:users,email', // Cek apakah email sudah ada di tabel users
            ],
            'nama' => 'required',
        ];
    }

    private function generateUsername($name)
    {
        $parts = explode(' ', strtolower($name));
        $firstName = $parts[0] ?? '';
        $secondName = $parts[1] ?? '';

        // Aturan: Gabungkan suku kata 1 & 2 jika <= 13 karakter
        if ($secondName != '' && (strlen($firstName) + strlen($secondName) + 1) <= 13) {
            $baseUsername = $firstName . '.' . $secondName;
        } else {
            // Jika lebih dari 13 atau hanya 1 kata, ambil suku kata pertama saja
            $baseUsername = $firstName;
        }

        // Hilangkan karakter non-alfanumerik kecuali titik
        $baseUsername = preg_replace('/[^a-z0-9.]/', '', $baseUsername);

        // Cek duplikasi di database
        $finalUsername = $baseUsername;
        $counter = 1;

        while (User::where('username', $finalUsername)->exists()) {
            $finalUsername = $baseUsername . $counter;
            $counter++;
        }

        return $finalUsername;
    }

    /**
     * Logic jika validasi gagal (email duplikat)
     * Kita biarkan kosong agar baris yang gagal otomatis dilewati tanpa menghentikan proses
     */
    public function onFailure(Failure ...$failures)
    {
        // Anda bisa mencatat error ke log jika perlu
        // Log::info('Baris diskip karena email duplikat');
    }
}
