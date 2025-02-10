#!/usr/bin/env bash
# wait-for-it.sh

set -e

host="trpg-mysql"
port=3306
shift
cmd="$@"

while ! mysqladmin ping -h "$host" --user="root" --password="$MYSQL_PW" --silent; do
  echo "MySQL is unavailable - sleeping"
  sleep 2
done

echo -e "\nMySQL is up - executing command"
node ./src/init/dbinit.js;
exec $cmd