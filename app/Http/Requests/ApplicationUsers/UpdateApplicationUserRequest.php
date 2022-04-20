<?php

namespace App\Http\Requests\ApplicationUsers;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateApplicationUserRequest extends FormRequest
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
            'app_id' => 'nullable',
            'name' => 'nullable|string',
            'lastname' => 'nullable|string',
            'mail' => 'nullable|email',
            'phone' => 'nullable|string',
            'balance' => 'nullable',
            'role' => 'nullable',
            'avatar' => 'nullable|string',
            'blocked' => 'nullable|boolean',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
