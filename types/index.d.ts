export const RS: "\u001E";
declare class JSONSequenceParser extends stream.Transform {
    _stream: DelimitedStream;
}
declare class JSONSequenceGenerator extends stream.Transform {
}
import stream = require("stream");
import { DelimitedStream } from "@sovpro/delimited-stream";
export { JSONSequenceParser as parser, JSONSequenceParser as Parser, JSONSequenceGenerator as generator, JSONSequenceGenerator as Generator };
