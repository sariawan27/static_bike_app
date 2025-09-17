<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{

    protected $fillable = [
        'user_id',
        'rpm',
        'voltage',
        'current',
        'power',
        'energy',
        'created_at',
        'updated_at',
    ];
}
