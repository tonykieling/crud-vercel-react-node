# crud-vercel-react-node  
working on migrating express to serverless alongside react app.

The solution found for dealing with serverless API requests and at the same time React APP routes is having vercel.json:
{
    "routes": [
        {
            "src": "/api",
            "dest": "/api"
        },
        { 
            "src": "/[^.]+", 
            "dest": "/"
        }
    ]
}

**more info at /api/about.txt**

