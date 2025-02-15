FROM httpd:2.4

COPY icons /usr/local/apache2/htdocs/icons/
COPY JSON /usr/local/apache2/htdocs/JSON/
COPY scripts /usr/local/apache2/htdocs/scripts/
COPY CHANGELOG.md /usr/local/apache2/htdocs/
COPY index.html /usr/local/apache2/htdocs/
COPY style.css /usr/local/apache2/htdocs/