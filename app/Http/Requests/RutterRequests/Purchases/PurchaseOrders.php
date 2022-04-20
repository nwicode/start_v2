<?php

namespace App\Http\Requests\RutterRequests\Purchases;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class PurchaseOrders extends FormRequest
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
            "access_token" => "required|string",
            "cursor" => "nullable|string",
            "business_name" => "required|string",
            "service_name" => "required|string",
            "start_date" => "nullable|date",
            "end_date" => "nullable|date",
            "offset" => "nullable|int",
            "limit" => "nullable|int",
            "order_by" => "nullable|string",
            "total_amount" => "nullable|numeric",
            "status" => "nullable|string",
            "ids" => "nullable|string",
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
