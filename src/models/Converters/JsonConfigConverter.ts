import { IKeymap, IUniversalKeymap, KeymapUtils } from "../IUniversalKeymap";
import { fsUtils } from "../Utils";
import { Converter } from "./Converter";
import { IShortcutConverter } from "./ShortcutConverters/ShortcutConverter";

export abstract class JsonConfigConverter<
  IdeConfig,
  IdeShortcut
> extends Converter<IdeShortcut> {
  protected configPath: string;

  constructor(
    ideMappingsName: string,
    configPath: string,
    scConverter: IShortcutConverter<IdeShortcut>
  ) {
    super(ideMappingsName, scConverter);
    this.configPath = configPath;
  }

  protected async readIdeKeymap(): Promise<IKeymap<IdeShortcut>> {
    let ideConfig = await fsUtils.readJson<IdeConfig>(this.configPath);
    return this.configToIdeKm(ideConfig);
  }
  protected writeIdeKeymap(ideKeymap: IKeymap<IdeShortcut>): Promise<void> {
    let newConfig = this.ideKmToConfig(ideKeymap);
    return fsUtils.saveJson<IdeConfig>(this.configPath, newConfig);
  }

  protected abstract configToIdeKm(ideConfig: IdeConfig): IKeymap<IdeShortcut>;
  protected abstract ideKmToConfig(ideKm: IKeymap<IdeShortcut>): IdeConfig;
}
