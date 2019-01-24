# Kusikusi Frontend

> The generic CMS frontend that can be used as a base for other Kusikusi based frontends

## Running in development mode

###### Env variables
The front end needs to know where the media and the API is located, so it looks for two env variables, if they are not set, the default values are /media and /api because the normal deployment is this editor to be located in the same place where the server is. If this needs to change, for example in development mode, two env variables needs to be set (or configured in quasar.conf.js) 

If the Kusikusi dev server is running in `http://127.0.0.1:8000/`
```
MEDIA_URL = http://127.0.0.1:8000/media
API_URL = http://127.0.0.1:8000/api
```

###### run development server (with default theme)
```bash 
$ quasar dev
```

###### PWA
```bash 
$ quasar dev -m pwa
```

###### Electron App
```bash 
$ quasar dev -m electron
```