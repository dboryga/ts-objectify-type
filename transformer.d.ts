import * as ts from "typescript";
declare const transformerProgram: (program: ts.Program) => ts.TransformerFactory<ts.SourceFile>;
export default transformerProgram;
