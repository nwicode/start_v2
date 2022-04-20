<?php

namespace App\Http\Requests\RutterRequests\Products;

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
            "access_token" => 'required|string',
            "product.name" => "required|string",
            "product.description" => "required|string",
            "product.variants.*.sku" => "required|string",
            "product.variants.*.price" => "nullable|numeric",
            "product.variants.*.option_values.*.name" => "required|string",
            "product.variants.*.option_values.*.value" => "nullable|string",
            "product.category_id" => "nullable|int",
            "product.tags" => "nullable|array",
            "product.tags.*" => "required|string",
            "product.images" => "nullable|array",
            "product.images.*.src" => "required|string",
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
