#!/usr/bin/env bash
export PGPASSWORD=$POSTGRES_PASSWORD

if [ ! -f /var/lib/postgresql/data/initflag ]; then
    echo "Initializing"
    touch /var/lib/postgresql/data/initflag
    psql -U $POSTGRES_USER -f /db.sql
fi