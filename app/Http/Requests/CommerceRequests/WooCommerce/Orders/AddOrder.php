<?php

namespace App\Http\Requests\CommerceRequests\WooCommerce\Orders;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class AddOrder extends FormRequest
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
            'payment_method' => 'required|string',
            'payment_method_title' => 'required|string',
            'set_paid' => 'required|boolean',
            'billing.first_name' => 'required|string',
            'billing.last_name' => 'required|string',
            'billing.address_1' => 'required|string',
            'billing.address_2' => 'nullable|string',
            'billing.city' => 'nullable|string',
            'billing.state' => 'nullable|string',
            'billing.postcode' => 'nullable|string',
            'billing.country' => 'nullable|string',
            'billing.email' => 'nullable|string',
            'billing.phone' => 'nullable|string',
            'shipping.first_name' => 'nullable|string',
            'shipping.last_name' => 'nullable|string',
            'shipping.address_1' => 'nullable|string',
            'shipping.address_2' => 'nullable|string',
            'shipping.city' => 'nullable|string',
            'shipping.state' => 'nullable|string',
            'shipping.postcode' => 'nullable|string',
            'shipping.country' => 'nullable|string',
            'line_items' => 'nullable|array',
            'line_items.*.product_id' => 'nullable|int',
            'line_items.*.quantity' => 'nullable|int',
            'line_items.*.variation_id' => 'nullable|int',
            'shipping_lines' => 'nullable|array',
            'shipping_lines.*.method_id' => 'nullable|string',
            'shipping_lines.*.method_title' => 'nullable|string',
            'shipping_lines.*.total' => 'nullable|numeric',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(["status" => false, "message" => $validator->getMessageBag()->toArray(), "errors" => $validator->errors()], 400));
    }
}
