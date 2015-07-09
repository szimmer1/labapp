## To install

Preferred server is Homestead. Can be used with any Apache or Nginx installation. To install dependencies:
In root dir:

    composer install
    npm install
    bower install

Generate a Laravel app key:
In root dir:

    cp .env.example .env
    php artisan key:generate

### License

The Laravel framework is open-sourced software licensed under the [MIT license](http://opensource.org/licenses/MIT)
