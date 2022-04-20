<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferralRelationship extends Model
{
    use HasFactory;

    public function referral_link() {
        return $this->belongsTo(ReferralLink::class)->with('referral_program');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
