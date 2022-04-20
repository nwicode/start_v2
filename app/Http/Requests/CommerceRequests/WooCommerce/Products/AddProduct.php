<?php

namespace App\Http\Requests\CommerceRequests\WooCommerce\Products;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddProduct extends FormRequest
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
            "name" => 'required|string',
            "type" => 'required|string',
            "regular_price" => 'required|numeric',
            "description" => 'nullable|string',
            "short_description" => 'nullable|string',
            "categories" => 'nullable|array',
            "categories.*.id" => 'required|int',
            "images" => 'nullable|array',
            "images.*.src" => 'required|string',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
