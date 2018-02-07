# Configuration of WoT Servient

File "wot-servient.conf.json"

```
{
    "servient": {
        "scriptDir": AUTORUN,
        "scriptAction": RUNSCRIPT
    },
    "http": {
        "port": HPORT
    },
    "log": {
        "level": LEVEL
    }
}
```

AUTORUN is a path string for the directory to load at startup

RUNSCRIPT is a boolean indicating whether to provide the 'runScript' Action

HPORT is a number defining the HTTP listening port

LEVEL is a string or number to set the logging level:

`{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }`
