import superagent from 'superagent';
import config from '@plone/volto/registry';
import { addHeadersFactory } from '@plone/volto/helpers/Proxy/Proxy';

const HEADERS = ['content-type', 'content-disposition', 'cache-control'];

/**
 * Get a resource image/file with authenticated (if token exist) API headers
 * @function getAPIResourceWithAuth
 * @param {Object} req Request object
 * @return {string} The response with the image
 */
export const forwardReloadRequest = (req, pass) =>
  new Promise((resolve, reject) => {
    const { settings } = config;

    let apiPath = '';
    if (settings.internalApiPath && __SERVER__) {
      apiPath = settings.internalApiPath;
    } else if (__DEVELOPMENT__ && settings.devProxyToApiPath) {
      apiPath = settings.devProxyToApiPath;
    } else {
      apiPath = settings.apiPath;
    }
    const apiURL = new URL(apiPath);
    const request = superagent
      .get(
        `${apiURL.hostname}:${apiURL.port}/VirtualHostBase/http/${req.headers.host}/VirtualHostRoot/${req.originalUrl}`,
      )
      .maxResponseSize(settings.maxResponseSize)
      .responseType('html');

    if (pass === 'admin') {
      request.set('Authorization', `Basic YWRtaW46YWRtaW4=`);
    } else if (pass === 'secret') {
      request.set('Authorization', `Basic YWRtaW46c2VjcmV0`);
    }
    request.use(addHeadersFactory(req));
    request.then(resolve).catch(reject);
  });

function reloadMiddleware(req, res, next) {
  forwardReloadRequest(req, 'admin')
    .then((resource) => {
      // Just forward the headers that we need
      HEADERS.forEach((header) => {
        if (resource.headers[header]) {
          res.set(header, resource.headers[header]);
        }
      });
      res.send(resource.body);
    })
    .catch((error) => {
      forwardReloadRequest(req, 'secret').then((resource) => {
        // Just forward the headers that we need
        HEADERS.forEach((header) => {
          if (resource.headers[header]) {
            res.set(header, resource.headers[header]);
          }
        });
        res.send(resource.body);
      });
    });
}

export default function () {
  if (__SERVER__) {
    const express = require('express');
    const middleware = express.Router();

    middleware.all(['/@@reload'], reloadMiddleware);
    middleware.id = 'reloadProcessor';
    return middleware;
  }
}
