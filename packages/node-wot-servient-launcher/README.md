# Servient Launcher for WoT

This package is a launcher that can be used to let  a servient run alls cripts in the current directory. 
It accepts configuraion via a json file called ``.wot.conf.json``.

## installing

```
[sudo] npm install -g node-wot-servient-launcher
```

## running

```
//in a directoty with scripts
$ wot-servient 
```

## configuraion

The default config is this:

```json
    {
        http: {
            port: 80
        },
        log : {
            level : 'info'
        }
    }
```

Provide a file called ``.wot.conf.json`` in the working directory to change the config.