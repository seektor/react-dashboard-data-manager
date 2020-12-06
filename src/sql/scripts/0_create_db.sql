SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'react-dashboard'
  AND pid <> pg_backend_pid();

DROP DATABASE IF EXISTS "react-dashboard";

CREATE DATABASE "react-dashboard";