export interface Schema {
  label: string;
  fileName: string;
}

export class SchemaTypes {
  public static readonly VISUAL_STUDIO: Schema = {
    label: 'Visual Studio',
    fileName: 'VisualStudio.json',
  };

  public static readonly ATOM: Schema = {
    label: 'Atom',
    fileName: 'atom.json',
  };

  public static readonly INTELLIJ: Schema = {
    label: 'IntelliJ',
    fileName: 'intelliJ.json',
  };

  public static readonly NOTEPADPP: Schema = {
    label: 'NodePad++',
    fileName: 'notepadplusplus.json',
  };

  public static readonly SUBLIME: Schema = {
    label: 'Sublime',
    fileName: 'sublime.json',
  };

  public static readonly VS_CODE: Schema = {
    label: 'Visual Studio Code',
    fileName: 'vscode.json',
  };

  public static readonly EMPTY: Schema = {
    label: 'Empty',
    fileName: 'empty.json',
  };

  public static readonly SCHEMAS: Schema[] = [
    SchemaTypes.VS_CODE,
    SchemaTypes.VISUAL_STUDIO,
    SchemaTypes.INTELLIJ,
    SchemaTypes.ATOM,
    SchemaTypes.NOTEPADPP,
    SchemaTypes.SUBLIME,
    SchemaTypes.EMPTY,
  ];
}
