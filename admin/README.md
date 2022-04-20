# Run in local machine
Steps:
1. Setup and run local Mysql server
2. Clone https://github.com/nwicode/saas_v2_core.git to `core` folder
3. Go to `core` folder and run `php artisan migrate --seed` (only once, after clone)
4. Run `php artisan jwt:secret` - for generate JWT key (only once, after clone)
5. Run `php artisan serve` - this command will start a local server at `http://localhost:8000`
6. Clone https://github.com/nwicode/saas_v2.git to `admin` folder and run `ng serve`. If you see ANY ERRORS in browser console, stop `ng serve` and run it with proxy `ng serve --proxy-config proxy.conf.json`
After that go to `http://localhost:4200/` and use:
- login `admin@admin.com`, pwd `admin` for login as admin
- login `customer@customer.com`, pwd `customer` for login as customer




Or you can add the nocors extension to your browser.

Or you can disable cors checking in your brouser: https://alfilatov.com/posts/run-chrome-without-cors/


# NWICODEV2

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.9.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.


## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
