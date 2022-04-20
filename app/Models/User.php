<?php

namespace App\Models;

use Illuminate\Support\Facades\DB;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'lastname',
        'email',
        'password',
        'last_updated',
        'user_type_id',
        'phone',
        'address',
        'user_type_id',
        'country',
        'avatar',
        'default_language',
        'company'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    protected function getUserTypeIdAttribute($value)
    {
        return 1;
    }

    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [];
    }

    /**
     * Set user password
     */
    public function setPasswordAttribute($value) {
        $this->attributes['password'] = bcrypt($value);
    }

    /**
     * Set last updated datetime
     */
    public function setLastUpdatedAttribute($value) {
        $this->attributes['last_updated'] = $value;
    }

    /**
     * Update personal information of the user.
     *
     * @param $name
     * @param $lastname
     * @param $phone
     * @param $country
     * @param $address
     * @param $company
     * @param $avatar
     */
    public function updatePersonalInformation($name, $lastname, $phone, $country, $address, $company,$avatar) {
        $this->update(['name'=>$name]);
        $this->update(['lastname'=>$lastname]);
        $this->update(['phone'=>$phone]);
        $this->update(['country'=>$country]);
        $this->update(['address'=>$address]);
        $this->update(['company'=>$company]);



        if ($avatar=="stay") {
            // nothing
        } else if ($avatar=="deleted") {
            //remove old avatar
            if(!empty($this->attributes['avatar']) && file_exists(public_path('storage/users/avatars/'.$this->attributes['avatar']))){
                unlink(public_path('storage/users/avatars/'.$this->attributes['avatar']));
            }
            $this->update(['avatar'=>""]);

        } else if ($avatar!=""){
            //remove old avatar
            if(!empty($this->attributes['avatar']) && file_exists(public_path('storage/users/avatars/'.$this->attributes['avatar']))){
                unlink(public_path('storage/users/avatars/'.$this->attributes['avatar']));
            }

            //update avatar
            $filename= $this->id . "-" . Str::random(9) . ".png";
            $output_file = 'storage/users/avatars/'.$filename;
            $ifp = fopen( $output_file, 'wb' );
            $data = explode( ',', $avatar );
            fwrite( $ifp, base64_decode($data[1] ) );
            fclose( $ifp );
            $this->update(['avatar'=>$filename]);
        }

    }

    /**
     * Update account information of the user.
     *
     * @param $email
     * @param $defaultLanguage
     */
    public function updateAccountInformation($email, $defaultLanguage, $role = 0) {
        $this->update(['email'=>$email]);
        $this->update(['default_language'=>$defaultLanguage]);
		//print($role);
		if ($role!=0) $this->update(['user_type_id'=>$role]);
    }

    /**
     * Block account of the user.
     *
     * @return int|mixed
     */
    public function blockAccount() {
        $this->blocked = 1;
        $this->save();
        return $this->blocked;
    }

    /**
     * Update password of the user with checking old password.
     *
     * @param $old
     * @param $new
     * @return bool
     */
    public function changePassword($old, $new) {
        if (Hash::check($old, $this->password)) {
            $this->update(['password'=>$new]);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Set default avatar.
     */
    public function setDefaultAvatar()
    {
        $default_avatar = DB::table('system_settings')->select('default_avatar')->get();

        $filename= $this->id . "-" . Str::random(9) . ".png";
        $output_file = 'storage/users/avatars/'.$filename;
        copy($default_avatar[0]->default_avatar, $output_file);
        $this->avatar = $filename;
        $this->save();
    }


    /**
     * Update user avatar.
     *
     * @param $avatar base64 string with image or string command.
     */
    public function setUserAvatar($avatar) {
        if ($avatar=="stay") {
            // nothing
        } else if ($avatar=="deleted") {
            //remove old avatar
            if ($this->avatar && file_exists(public_path('storage/users/avatars/'.$this->avatar))){
                unlink(public_path('storage/users/avatars/'.$this->avatar));
            }
            $this->update(['avatar'=>""]);

        } else if ($avatar!=""){
            //remove old avatar
            if ($this->avatar && file_exists(public_path('storage/users/avatars/'.$this->avatar))){
                unlink(public_path('storage/users/avatars/'.$this->avatar));
            }

            //update avatar
            $filename= $this->id . "-" . Str::random(9) . ".png";
            $output_file = 'storage/users/avatars/'.$filename;
            $ifp = fopen( $output_file, 'wb' );
            $data = explode( ',', $avatar );
            fwrite( $ifp, base64_decode($data[1] ) );
            fclose( $ifp );
            $this->update(['avatar'=>$filename]);
        }
    }
}
