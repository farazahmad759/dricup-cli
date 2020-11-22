import fs from "fs";
import path from "path";
export const getRelativePath = (referencePath, otherPath) => {
  let relativePath = path.relative(
    path.dirname(process.cwd() + "/" + otherPath),
    path.dirname(process.cwd() + "/" + referencePath)
  );
  while (relativePath.includes("\\")) {
    relativePath = relativePath.replace("\\", "/");
  }
  relativePath += "/";
  console.log("==================", relativePath); //'../../img'
  return relativePath;
};

export const readEcagConfigFile = () => {
  let filePath = process.cwd() + "/ecag.config.json";
  var dvCrudConfig = {};
  // TODO if ecag.config.json not exists in cwd(), then create one
  if (fs.existsSync(filePath)) {
    dvCrudConfig = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return dvCrudConfig;
};
