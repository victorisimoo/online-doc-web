FROM php:7.3.12-apache

COPY 000-default.conf /etc/apache2/sites-available/000-default.conf
COPY start-apache /usr/local/bin
RUN a2enmod rewrite
RUN a2enmod headers

# Copy application source
COPY /audio/ /var/www/html/doctoronline/web/audio/
COPY /config/ /var/www/html/doctoronline/web/config/
COPY /css/ /var/www/html/doctoronline/web/css/
COPY /img/ /var/www/html/doctoronline/web/img/
COPY /js/ /var/www/html/doctoronline/web/js/
COPY /lib/ /var/www/html/doctoronline/web/lib/
COPY /private/ /var/www/html/doctoronline/web/private/
COPY /views/ /var/www/html/doctoronline/web/views/
COPY /index.php /var/www/html/doctoronline/web/
COPY /sitemap.xml /var/www/html/doctoronline/web/
COPY /indexroot.php /var/www/html/doctoronline/index.php
COPY /.htaccess /var/www/html/doctoronline/.htaccess

COPY /dronline-corporate-web/audio/ /var/www/html/doctoronline/webm/audio/
COPY /dronline-corporate-web/config/ /var/www/html/doctoronline/webm/config/
COPY /dronline-corporate-web/css/ /var/www/html/doctoronline/webm/css/
COPY /dronline-corporate-web/img/ /var/www/html/doctoronline/webm/img/
COPY /dronline-corporate-web/js/ /var/www/html/doctoronline/webm/js/
COPY /dronline-corporate-web/lib/ /var/www/html/doctoronline/webm/lib/
COPY /dronline-corporate-web/private/ /var/www/html/doctoronline/webm/private/
COPY /dronline-corporate-web/views/ /var/www/html/doctoronline/webm/views/
COPY /dronline-corporate-web/index.php /var/www/html/doctoronline/webm/
COPY /dronline-corporate-web/sitemap.xml /var/www/html/doctoronline/webm/



RUN chown -R www-data:www-data /var/www

CMD ["start-apache"]