import DataURIParser from "datauri/parser";
import path from 'path';

const getDataUri = (file) => {
    const parser = new DataURIParser();
    const extName = path.extname(file.originalName()).toString();

    return parser.format(extName, file.content);
}

export default getDataUri;