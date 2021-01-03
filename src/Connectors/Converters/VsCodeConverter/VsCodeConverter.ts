import { UniversalKeymap } from '../../Keymap';
import { SchemaTypes } from '../../Schema/Schema';
import { fsUtils } from '../../Utils';
import { Converter } from '../Converter';
import { StrShortcutConverter } from '../ShortcutConverter';
import { VsCodeKeybinding, VsCondeConfig, VsCodeShortcut } from './VsCodeConverter.models';
import { KEYBINDINGS_PATH } from '../../Constants/VsCode';
import { LoadSchema } from '../../Schema/SchemaLoader';
import { Keymap } from '../../Keymap';

export class VsCodeConverter extends Converter<VsCodeShortcut> {
  private configPath: string;
  private readonly schema = SchemaTypes.VS_CODE
  private readonly substractChar = "-";

  constructor(configPath?: string) {
    super('vscode.json', new StrShortcutConverter());

    this.configPath = configPath ?? KEYBINDINGS_PATH;
  }

  public async save(keymap: UniversalKeymap): Promise<any> {
    const ideKeymap = await this.toIdeKeymap(keymap);

    const ideSchema = await this.fetchIdeSchema(this.schema);

    const newConfig = ideKeymap.keys().flatMap<VsCodeKeybinding>(
      (ideKey) => {
        const bindings: VsCodeKeybinding[] = ideKeymap.get(ideKey).map(
          (ideShortcut) => {
            return {
              key: ideShortcut,
              command: ideKey,
            };
          }
        );

        //Unbind default shortcuts

          bindings.push(
            ...ideSchema.get(ideKey).map((ideSchemaKey) => {
               return {
                key: ideSchemaKey,
                command: `-${ideKey}`,
                       };
            })
          );


        return bindings;
      }
    );

    return fsUtils.saveJson<VsCondeConfig>(this.configPath, newConfig);
  }
  public async load(): Promise<UniversalKeymap> {
    const ideConfig = await fsUtils.readJson<VsCondeConfig>(this.configPath);
    const schema = await LoadSchema(this.schema)

    const ideKeymapToRemove = new Keymap<VsCodeShortcut>();
    const ideKeymapToAdd = new Keymap<VsCodeShortcut>();

    ideConfig.forEach((vsCodeKb)=> {
      let command = vsCodeKb.command;
      if (command.startsWith(this.substractChar)){
        command= command.substring(this.substractChar.length);
        ideKeymapToRemove.add(command,vsCodeKb.key);
      }
      else{
        ideKeymapToAdd.add(command,vsCodeKb.key);
      }
    })

    const uniKeymapToRemove = await this.fromIdeKeymap(ideKeymapToRemove);
    const uniKeymapToAdd = await this.fromIdeKeymap(ideKeymapToAdd);

    schema.removeKeymap(uniKeymapToRemove);
    schema.addKeymap(uniKeymapToAdd);
    return schema;
  }
}
