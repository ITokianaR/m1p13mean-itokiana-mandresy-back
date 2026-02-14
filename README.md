# M1P13MEAN-itokiana-mandresy-back

Node express project.

## Start project

Install node modules and run the project using npm.

```bash
npm i
npm run dev
```
## Create .env

Remove .example and .env.example and insert your own credentials

```bash
DB_USERNAME=itokiana
DB_PASSWORD=itokiana
JWT_SECRET=5dd4a5de29b67e9dd0e8b29ff4a6b8a9
```

## Available routes as of now

You can test these routes using Postman or Thunderclient

```bash
# GET protected routes 
# Don't forget to add token bearers from login in Headers section when running it
http://localhost:3000/api/users/admin
http://localhost:3000/api/users/shop
http://localhost:3000/api/users/client

# POST routes
http://localhost:3000/api/auth/login
http://localhost:3000/api/auth/register

# Dummy json datas to test
login
{
    "email": "admin@mongo.fr",
    "password": "admin1234"
}
register
{
    "username": "john",
    "fullname": "doe",
    "email": "johndoe@mongo.fr",
    "password": "pwdspecial",
    "role": "shop"
}

```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)