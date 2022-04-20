<?php

namespace App\Http\Requests\Referrals\Programs;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GetReferralProgramRequests extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'id' => 'nullable|exists:referral_programs,id',
            'name' => 'nullable|exists:referral_programs,name',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
