<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoryRecord extends Model
{
    protected $fillable = [
        'user_id',
        'start',
        'end',
    ];
}
