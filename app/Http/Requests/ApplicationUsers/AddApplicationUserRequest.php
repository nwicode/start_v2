<?php

namespace App\Http\Requests\ApplicationUsers;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddApplicationUserRequest extends FormRequest
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
            'app_id' => 'required',
            'name' => 'required|string',
            'lastname' => 'required|string',
            'password' => 'required|string',
            'mail' => 'required|email',
            'phone' => 'nullable',
            'balance' => 'nullable',
            //'role' => 'required|int|min:0',
            'avatar' => 'nullable|string',
            'blocked' => 'nullable|boolean',
            'last_date' => 'nullable|date',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
