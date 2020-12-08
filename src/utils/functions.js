import dvGenerators from "./../generators/index";
export async function generateContentFromSchemaFiles(params, jsonFullContents) {
  jsonFullContents.forEach((_content, i) => {
    // migration content
    let _mig = dvGenerators.dvMigrations.buildContent({
      jsonData: _content.schema,
      dvCrudConfig: params.dvCrudConfig,
    });
    jsonFullContents[i].migration = _mig;
    // model content
    let _model = dvGenerators.dvModels.buildContent({
      jsonData: _content.schema,
      dvCrudConfig: params.dvCrudConfig,
    });
    jsonFullContents[i].model = _model;
    // controller content
    let _controller = dvGenerators.dvControllers.buildContent({
      jsonData: _content.schema,
      dvCrudConfig: params.dvCrudConfig,
    });
    jsonFullContents[i].controller = _controller;
    // route content
    let _route = dvGenerators.dvRoutes.buildContent({
      jsonData: _content.schema,
      dvCrudConfig: params.dvCrudConfig,
    });
    jsonFullContents[i].route = _route;
  });
}
