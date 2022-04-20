# NWICODEv2 platform (START version 1.0.6)
![](https://nwicode.com/upload/CMax/5a4/i6dfl567pl5yq3krn7d0m8g72jq1226f/nwcode_500x150-Logo_p-_1_.png)
## Links & Stuff

- [User documentation](https://docs.nwcode.io/ "User documentation")
- [Developer documentation](https://github.com/nwicode/nwicode_api/ "Developer documentation")
- [Community](https://forum.nwicode.com/ "Community")

**##Structure and interaction**

The constructor consists of three parts:

frontend (on the Angular framework)
backend (on the Laravel framework)
mobile (Ionic framework)

The interaction between them occurs through GET/POST requests. Since we write the frontend separately, we will not have to use View in laravel itself.

The production-generated frontend will be located at the root of the domain. So, public from laravel will also be configured on the root of the folder. Thus, both projects will be combined in the same directory, and therefore no additional Apache configuration will be needed.

A database is needed for the backend to function.

For the backend to function, a PHP version of at least 8.0 is required

For the frontend to function, npm must be installed.

Composer must be installed for PHP.

## Install steps

First of all, you need to set up a working WEB server and MySQL server. You can use OpenServer, LAMP, XAMP, and/or other assemblies.
In the future, we will assume that the DOCUMENT_ROUT of the server is the 'start' folder, and mysql is already started.

1. Clone git to local machine `git clone https://github.com/nwicode/start_2.git start`
2. Open 'start' folder and instal php libreries `php composer install`
3. Prepare mysql (create database and add credentials to .env file)
4. Migrate data to MySQL `php artisan migrate --seed`

****
For frontend developing you must build Angular project of platform admin part. For that, follow nest steps:
1. go to admin folder `cd admin`
2. Install NPM dependencies `npm install`
3. Buld sources to 'public' folder `ng build --output-path=../public --delete-output-path=false`
4. If you need to apply changes in runtime - build sources with --watch options `ng build --output-path=../public --delete-output-path=false`
5. MB you need to create new App key - `php artisan key:generate`

Open in browser `http://localhost` or the URL you configured your server to.
