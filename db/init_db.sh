#!/usr/bin/env bash
export PGPASSWORD=$POSTGRES_PASSWORD

psql -U $POSTGRES_USER -f db.sql
