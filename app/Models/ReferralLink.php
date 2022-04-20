<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Ramsey\Uuid\Uuid;

class ReferralLink extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'referral_program_id',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function (ReferralLink $model) {
            $model->generateCode();
        });

    }

    public static function getReferral($user, ReferralProgram $program)
    {
        return static::firstOrCreate([
            'user_id' => $user->id,
            'referral_program_id' => $program->id
        ]);
    }

    public function getLinkAttribute()
    {
        return url($this->program->uri) . '?ref=' . $this->code;
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, ReferralRelationship::class, 'referral_link_id', 'id', 'id', 'user_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function referral_program()
    {
        return $this->belongsTo(ReferralProgram::class, 'referral_program_id');
    }

    public function program()
    {
        return $this->belongsTo(ReferralProgram::class, 'referral_program_id');
    }

    public function relationships()
    {
        return $this->hasMany(ReferralRelationship::class);
    }

    private function generateCode()
    {
        $this->code = (string)Uuid::uuid1();
    }

}
