Run `python2 instant_search_analysis.py` to get data for this visualisation for a specific language.
This needs a `creds.py` file container MongoDB credentials in the same folder in the following format:

```
def get_creds():
    return {
        "username": "{username}",
        "password": "{password}"
    }
```
