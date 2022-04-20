<?php

namespace Database\Factories;

use App\Models\ApplicationUser;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ApplicationUserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ApplicationUser::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'app_id' => Str::random(5),
            'name' => $this->faker->name(),
            'mail' => $this->faker->email(),
            'phone' => $this->faker->phoneNumber(),
            'balance' => $this->faker->randomFloat(2, 0, 10),
            'role' => $this->faker->numberBetween(1,10),
            'avatar' => $this->faker->imageUrl(),
            'blocked' => $this->faker->boolean(),
            'last_date' => $this->faker->date(),
        ];
    }
}
