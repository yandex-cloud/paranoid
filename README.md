# Paranoid
Paranoid is the library for displaying cluster topologies.

### Development mode and preview
To start developing paranoid, invoke the following commands
```
npm ci
npm start
```
and make your changes to the sources.

### API

* `renderGraph(domNodeId: string, data: Data, opts?: Options)`:
  *  `domNodeId` - the id of DOM element where graph will be rendered
  *  `data` and `opts` - [data and options for rendering a graph](#models)


### Models
[See here](./src/lib/models.ts)
