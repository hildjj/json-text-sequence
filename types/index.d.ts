export const RS: "\u001E";
export class JSONSequenceParser extends Transform {
    _stream: DelimitedStream;
    _transform(chunk: any, encoding: any, cb: any): void;
    _final(cb: any): void;
}
export class JSONSequenceGenerator extends Transform {
    _transform(chunk: any, _encoding: any, cb: any): any;
}
import { Transform } from 'node:stream';
import { DelimitedStream } from '@sovpro/delimited-stream';
export { JSONSequenceParser as Parser, JSONSequenceGenerator as Generator };
