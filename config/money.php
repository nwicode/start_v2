<?php

use PostScripton\Money\MoneySettings;

return [
    /*
    |--------------------------------------------------------------------------
    | Default currency
    |--------------------------------------------------------------------------
    |
    | This option controls the default currency of the package when user
    | doesn't provide any currency in methods. The default one will be
    | chosen from this option.
    | The code of the currency must be provided: USD, EUR, RUB, ...
    |
    */
    'default_currency' => 'USD',

    /*
    |--------------------------------------------------------------------------
    | Currency Lists
    |--------------------------------------------------------------------------
    |
    | This option controls which list of currencies will be used.
    |
    | For now following lists are provided:
    | 1. all - all the currencies in the world.
    | 2. popular - only the most popular ones (35) are used. (default)
    | 3. custom - only custom currencies
    | 4. ['840', 'EUR', 'RUB'] - array of currency codes you need. Selects from
    |                            lists both "all" and "custom_currencies" below
    |
    | Segregation of currencies is assumed for performance purposes so that
    | unnecessary ones won't be used.
    |
    */
    'currency_list' => 'popular',

    /*
    |--------------------------------------------------------------------------
    | Custom currencies
    |--------------------------------------------------------------------------
    |
    | This option allows you to create you own currencies.
    |
    | Each custom currency represents an array with properties:
    | 1. full_name  - a full qualified name of an currency
    | 2. name       - a short name of a currency
    | 3. iso_code   - an alphabetic code
    | 4. num_code   - a numeric code
    | 5. symbol     - a symbol of a currency.
    |               If there are more than one, array of strings is passed.
    |               "$" or ["$", "$$", "$$$"]
    | 6. position   - a position of a currency either in the beginning or in the end
    |               Currency::POSITION_START or Currency::POSITION_END
    |
    | Example of the existing currency:
    | [
    |   'full_name' => 'United States dollar',
    |   'name' => 'dollar',
    |   'iso_code' => 'USD',
    |   'num_code' => '840',
    |   'symbol' => '$',
    |   'position' => Currency::POSITION_START,
    | ]
    */
    'custom_currencies' => [],

    /*
    |--------------------------------------------------------------------------
    | Service
    |--------------------------------------------------------------------------
    |
    | This option controls the default service for converting currencies using API.
    |
    | Supported: "exchangeratesapi", "openexchangerates" and "exchangerate"
    |
    | exchangerate (default)
    |
    */
    'service' => 'exchangerate',

    /*
    |--------------------------------------------------------------------------
    | Services
    |--------------------------------------------------------------------------
    |
    | This option contains all the API services for converting currencies
    |
    */
    'services' => [
        'exchangeratesapi' => [
            // https://exchangeratesapi.io/
            'class' => \PostScripton\Money\Services\ExchangeRatesAPIService::class,
            'key' => env('EXCHANGERATESAPI_API_KEY'),
            'secure' => env('EXCHANGERATESAPI_SECURE', false),
            'base_restriction' => env('EXCHANGERATESAPI_BASE_RESTRICTION', true),
        ],
        'openexchangerates' => [
            // https://openexchangerates.org/
            'class' => \PostScripton\Money\Services\OpenExchangeRatesService::class,
            'key' => env('OPENEXCHANGERATES_API_KEY'),
            'base_restriction' => env('OPENEXCHANGERATES_BASE_RESTRICTION', true),
        ],
        'exchangerate' => [
            // https://exchangerate.host/
            'class' => \PostScripton\Money\Services\ExchangeRateService::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Thousands separator
    |--------------------------------------------------------------------------
    |
    | This option controls the default separator between thousands
    | like 1( )000( )000.
    |
    */
    'thousands_separator' => ' ',

    /*
    |--------------------------------------------------------------------------
    | Decimal separator
    |--------------------------------------------------------------------------
    |
    | This option controls the default separator between decimals
    | like 123(.)4.
    |
    */
    'decimal_separator' => '.',

    /*
    |--------------------------------------------------------------------------
    | Number of digits after decimal
    |--------------------------------------------------------------------------
    |
    | This option controls the default number of digits after
    | the decimal separator like 123.(4)
    |
    */
    'decimals' => 1,

    /*
    |--------------------------------------------------------------------------
    | Ends with 0
    |--------------------------------------------------------------------------
    |
    | This option controls whether a money string ends with 0 or not.
    | When true is provided: 123(.0)
    | When false is provided: 123()
    |
    */
    'ends_with_0' => false,

    /*
    |--------------------------------------------------------------------------
    | Space between currency and number
    |--------------------------------------------------------------------------
    |
    | This option controls whether there is a space between currency symbol and number
    | When true is provided: $( )100
    | When false is provided: $()100
    |
    */
    'space_between' => true,

    /*
    |--------------------------------------------------------------------------
    | Origin number from database
    |--------------------------------------------------------------------------
    |
    | This option controls the default origin for any number that will be passed
    | for creating a Money object.
    | It is used, for instance, if all of your money numbers from database are
    | represented as integer or float.
    |
    | For integer you would save money like: 1234, and would like to get "$ 123.4"
    | For float you would save money line: 123.4, and you would get "$ 123.4"
    |
    | Now only two values are provided:
    | MoneySettings::ORIGIN_INT
    | MoneySettings::ORIGIN_FLOAT
    |
    */
    'origin' => MoneySettings::ORIGIN_INT,
];
