<?php

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{

    protected $fillable = [
        'user_id',
        'hrc_id',
        'rpm',
        'voltage',
        'current',
        'power',
        'energy',
        'created_at',
        'updated_at',
    ];

    protected function serializeDate(DateTimeInterface $date)
    {
        return $date->format('Y-m-d H:i:s');
    }
}
