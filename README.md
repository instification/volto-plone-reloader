An add-on to pass `/@@reload` to the backend.

## Overview

The Plone addon [plone.reload](https://pypi.org/project/plone.reload/) provides a code reloader for your Plone backend.

Unfortunately this currently does not work through a Volto frontend as the route is unknown and the request doesn't get to the backend. Instead you must run it from a different window or tab directly on the backend.

This addon aims to resolve this problem by:

 - Creating an express middleware layer to forward requests to `/@@reload` to the backend.
 - Changes the `apiPath` to remove the Plone site (`@@reload` must be run from the zope root).
 - Adds VirtualHost parameters to the url to ensure the reload actions go through volto.
 - Authenticates the call with either admin:admin or admin:secret, the default credentials for plone dev instances.

## Installation

Install the addon with yarn:

```
yarn add volto-plone-reloader -W
yarn install
```

Then the reload middleware will be accesible via http://localhost:3000/@@reload

## Credits

Jon Pentland ([instification](https://github.com/instification))
