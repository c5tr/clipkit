# Docs

## Set user as admin

`docker exec -it clipkit-db psql -U postgres -d clipkit -c "UPDATE \"User\" SET \"isAdmin\" = true WHERE username = 'yourusername'`