<?php

namespace Database\Factories;

use App\Models\UserSubscription;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserSubscriptionFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = UserSubscription::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => $this->faker->numberBetween(1, 208),
            'subscription_id' => $this->faker->unique()->safeEmail(),
            'write_off_date' => $this->faker->dateTimeInInterval(),
            'next_write_off_date' => $this->faker->date(),
            'is_onetime_payment' => $this->faker->boolean(),
            'amount' => $this->faker->numberBetween(10, 1000,),
            'period' => $this->faker->randomElement(["ONETIME", "MONTHLY", "YEARLY"]),
            'is_canceled' => $this->faker->boolean(),
        ];
    }
}
