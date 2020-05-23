#! /bin/bash

export PGPASSWORD=postgres

echo "Taking a quick nap... (waiting for db)" && sleep 5
psql -h db -U postgres -d postgres < /db-setup/db-schema.sql > /dev/null
echo "Created schema"
psql -h db -U postgres -d postgres < /db-setup/db-seed-data.sql > /dev/null
echo "Seeded test data"
psql -h db -U postgres -d postgres -c "REFRESH MATERIALIZED VIEW videos_view"
echo "All Done"
