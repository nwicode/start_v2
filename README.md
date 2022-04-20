# NWICODEv2 platform (START version 1.0.6)
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