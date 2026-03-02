# M1P13MEAN-itokiana-mandresy-back

Node express project.
Backend :
https://m1p13mean-itokiana-mandresy-back.onrender.com/

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
# GET routes 
# Don't forget to add token bearers from login in Headers section when running it
http://localhost:3000/api/shops
http://localhost:3000/api/shops/:shopId
http://localhost:3000/api/shops/category
http://localhost:3000/api/shops/category/:categoryId

http://localhost:3000/api/events
http://localhost:3000/api/events/:eventId
http://localhost:3000/api/events/category
http://localhost:3000/api/events/category/:categoryId

# POST routes
http://localhost:3000/api/auth/login
http://localhost:3000/api/auth/register
http://localhost:3000/api/shops/add
http://localhost:3000/api/shops/category/add

# PUT route
http://localhost:3000/api/shops/:shopId
http://localhost:3000/api/events/:eventsId

# DELETE route
http://localhost:3000/api/shops/delete/:shopId
http://localhost:3000/api/events/delete/:eventsId

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
    "email": "johndoe@dummy.john",
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

# Google OAuth
GOOGLE_CLIENT_ID=453868918785-61tuh0bcb5skljoelvi4e8uik18p5g9n.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# Frontend URL
FRONTEND_URL=http://localhost:4200

# Email service
EMAIL_USER=mandresyrakotonanahary@gmail.com
EMAIL_PASS=lnsq jpnm wreg chts