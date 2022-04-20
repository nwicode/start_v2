<?php

namespace App\Http\Requests\GoogleAnalytics;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class GAGetReport extends FormRequest
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
            'access_token' => 'required_with:view_id|string',
            'view_id' => 'required_without:property_id|string',
            'property_id' => 'required_without:view_id|string',
            'start_date' => ['required', 'regex:/(^[0-9]{4}-[0-9]{2}-[0-9]{2}|today|yesterday|[0-9]+(daysAgo))/u'],
            'end_date' => ['required', 'regex:/(^[0-9]{4}-[0-9]{2}-[0-9]{2}|today|yesterday|[0-9]+(daysAgo))/u'],
            'metrics' => ['nullable', 'array'],
            'dimensions' => ['nullable', 'array'],
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
