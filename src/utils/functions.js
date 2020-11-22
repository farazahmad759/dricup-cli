import fs from "fs";
import path from "path";
export const getRelativePath = (referencePath, otherPath) => {
  let relativePath = path.relative(
    path.dirname(referencePath),
    path.dirname(otherPath)
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
  if (fs.existsSync(filePath)) {
    dvCrudConfig = JSON.parse(fs.readFileSync(filePath, "utf8"));
  }
  return dvCrudConfig;
};
