import { DelimitedStream } from '@sovpro/delimited-stream';
import { Transform } from 'node:stream';
export declare const RS = "\u001E";
export declare class JSONSequenceParser extends Transform {
    _stream: DelimitedStream;
    /**
     * Create a JSONSequenceParser instance.
     *
     * @param {import('stream').TransformOptions} [opts] Stream options.
     */
    constructor(opts?: import('stream').TransformOptions);
    /**
     * @param {Buffer} chunk
     * @param {BufferEncoding} encoding
     * @param {(er: Error|null|undefined) => void} cb
     * @ignore
     */
    _transform(chunk: Buffer, encoding: BufferEncoding, cb: (er: Error | null | undefined) => void): void;
    /**
     * @param {(er: Error?) => void} cb
     * @ignore
     */
    _final(cb: (er: Error | null) => void): void;
}
export declare class JSONSequenceGenerator extends Transform {
    /**
     * Create a JSONSequenceGenerator instance.
     *
     * @param {import('stream').TransformOptions} [opts] Stream options.
     */
    constructor(opts?: import('stream').TransformOptions);
    /**
     * @param {Buffer} chunk
     * @param {BufferEncoding} _encoding
     * @param {(er?: Error|null|undefined) => void} cb
     * @ignore
     */
    _transform(chunk: Buffer, _encoding: BufferEncoding, cb: (er?: Error | null | undefined) => void): void;
}
export { JSONSequenceParser as Parser, JSONSequenceGenerator as Generator, };
